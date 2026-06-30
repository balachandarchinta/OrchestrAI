import json
import requests
import sys
import subprocess
import os

# Force UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8001/api"
DB_PATH = "data/db.json"
PASS = "PASS"
FAIL = "FAIL"

results = []

def load_db():
    with open(DB_PATH, "r") as f:
        return json.load(f)

def get_workspaces_api():
    r = requests.get(f"{BASE_URL}/workspaces/")
    r.raise_for_status()
    return r.json()

def create_workspace(name, scenario="Test"):
    r = requests.post(f"{BASE_URL}/workspaces/", json={"name": name, "scenario": scenario})
    r.raise_for_status()
    return r.json()

def delete_workspace(ws_id):
    r = requests.delete(f"{BASE_URL}/workspaces/{ws_id}")
    return r.status_code, r.json()

def check(label, condition, detail=""):
    status = PASS if condition else FAIL
    results.append((status, label, detail))
    icon = "[OK]" if condition else "[!!]"
    print(f"  {icon} {label}" + (f" -- {detail}" if detail else ""))
    return condition

def validate_state(expected_ids, expected_names, deleted_id, deleted_name, tag):
    print(f"\n  Validating state after '{tag}'...")

    api_ws = get_workspaces_api()
    api_ids  = [w["id"] for w in api_ws]

    db = load_db()
    db_ws = db.get("workspaces", [])
    db_ids = [w["id"] for w in db_ws]

    check(f"API: deleted '{deleted_name}' is gone",
          deleted_id not in api_ids, f"remaining ids={api_ids}")
    check(f"DB:  deleted '{deleted_name}' is gone",
          deleted_id not in db_ids, f"remaining ids={db_ids}")

    for eid, ename in zip(expected_ids, expected_names):
        check(f"API: '{ename}' still present", eid in api_ids)
    for eid, ename in zip(expected_ids, expected_names):
        check(f"DB:  '{ename}' still present", eid in db_ids)

    check("DB: no duplicate IDs",
          len(db_ids) == len(set(db_ids)), f"ids={db_ids}")
    check("API count == DB count",
          len(api_ids) == len(db_ids), f"api={len(api_ids)} db={len(db_ids)}")
    check(f"Exactly {len(expected_ids)} workspace(s) remain",
          len(api_ids) == len(expected_ids), f"found={len(api_ids)}")

def reseed():
    result = subprocess.run(
        [sys.executable, "seed.py"],
        capture_output=True, text=True, cwd=os.getcwd()
    )
    print(result.stdout.strip())
    return result.returncode == 0

def section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

# ── SETUP ────────────────────────────────────────────────────
section("SETUP: Reseed database to known state")

if not reseed():
    print("SEED FAILED. Aborting.")
    sys.exit(1)

ws_all = get_workspaces_api()
ID_Q3 = next(w["id"] for w in ws_all if w["name"] == "Q3 Pricing Review")
ID_VN = next(w["id"] for w in ws_all if w["name"] == "Vendor Negotiation")
ID_PL = next(w["id"] for w in ws_all if w["name"] == "Product Launch")

print(f"  Q3 Pricing Review     -> {ID_Q3}")
print(f"  Vendor Negotiation    -> {ID_VN}")
print(f"  Product Launch        -> {ID_PL}")
check("Seeded IDs are all unique", len({ID_Q3, ID_VN, ID_PL}) == 3)

# ── TEST 1: Delete Q3 Pricing Review ─────────────────────────
section("TEST 1: Delete Q3 Pricing Review")

status, body = delete_workspace(ID_Q3)
check("DELETE returned 200", status == 200, f"status={status}")
check("Response names correct workspace", body.get("deleted") == "Q3 Pricing Review", f"body={body}")
validate_state(
    expected_ids=[ID_VN, ID_PL],
    expected_names=["Vendor Negotiation", "Product Launch"],
    deleted_id=ID_Q3, deleted_name="Q3 Pricing Review",
    tag="Delete Q3 Pricing Review"
)

# ── RESET ─────────────────────────────────────────────────────
reseed()
ws_all = get_workspaces_api()
ID_Q3 = next(w["id"] for w in ws_all if w["name"] == "Q3 Pricing Review")
ID_VN = next(w["id"] for w in ws_all if w["name"] == "Vendor Negotiation")
ID_PL = next(w["id"] for w in ws_all if w["name"] == "Product Launch")

# ── TEST 2: Delete Vendor Negotiation ────────────────────────
section("TEST 2: Delete Vendor Negotiation")

status, body = delete_workspace(ID_VN)
check("DELETE returned 200", status == 200, f"status={status}")
check("Response names correct workspace", body.get("deleted") == "Vendor Negotiation", f"body={body}")
validate_state(
    expected_ids=[ID_Q3, ID_PL],
    expected_names=["Q3 Pricing Review", "Product Launch"],
    deleted_id=ID_VN, deleted_name="Vendor Negotiation",
    tag="Delete Vendor Negotiation"
)

# ── RESET ─────────────────────────────────────────────────────
reseed()
ws_all = get_workspaces_api()
ID_Q3 = next(w["id"] for w in ws_all if w["name"] == "Q3 Pricing Review")
ID_VN = next(w["id"] for w in ws_all if w["name"] == "Vendor Negotiation")
ID_PL = next(w["id"] for w in ws_all if w["name"] == "Product Launch")

# ── TEST 3: Delete Product Launch ────────────────────────────
section("TEST 3: Delete Product Launch")

status, body = delete_workspace(ID_PL)
check("DELETE returned 200", status == 200, f"status={status}")
check("Response names correct workspace", body.get("deleted") == "Product Launch", f"body={body}")
validate_state(
    expected_ids=[ID_Q3, ID_VN],
    expected_names=["Q3 Pricing Review", "Vendor Negotiation"],
    deleted_id=ID_PL, deleted_name="Product Launch",
    tag="Delete Product Launch"
)

# ── RESET ─────────────────────────────────────────────────────
reseed()
ws_all = get_workspaces_api()
ID_Q3 = next(w["id"] for w in ws_all if w["name"] == "Q3 Pricing Review")
ID_VN = next(w["id"] for w in ws_all if w["name"] == "Vendor Negotiation")
ID_PL = next(w["id"] for w in ws_all if w["name"] == "Product Launch")

# ── TEST 4: New Workspaces — Delete A, B remains ─────────────
section("TEST 4: New workspaces — Delete A, Workspace B remains")

ws_a = create_workspace("Workspace A")
ws_b = create_workspace("Workspace B")
ID_A, ID_B = ws_a["id"], ws_b["id"]
check("Workspace A has unique ID", ID_A not in {ID_Q3, ID_VN, ID_PL, ID_B})
check("Workspace B has unique ID", ID_B not in {ID_Q3, ID_VN, ID_PL, ID_A})

status, body = delete_workspace(ID_A)
check("Delete Workspace A returned 200", status == 200, f"status={status}")
validate_state(
    expected_ids=[ID_Q3, ID_VN, ID_PL, ID_B],
    expected_names=["Q3 Pricing Review", "Vendor Negotiation", "Product Launch", "Workspace B"],
    deleted_id=ID_A, deleted_name="Workspace A",
    tag="Delete Workspace A (Workspace B remains)"
)

# ── TEST 5: Delete B ─────────────────────────────────────────
section("TEST 5: New workspaces — Delete B (A already gone)")

status, body = delete_workspace(ID_B)
check("Delete Workspace B returned 200", status == 200, f"status={status}")
validate_state(
    expected_ids=[ID_Q3, ID_VN, ID_PL],
    expected_names=["Q3 Pricing Review", "Vendor Negotiation", "Product Launch"],
    deleted_id=ID_B, deleted_name="Workspace B",
    tag="Delete Workspace B"
)

# ── RESET ─────────────────────────────────────────────────────
reseed()
ws_all = get_workspaces_api()
ID_Q3 = next(w["id"] for w in ws_all if w["name"] == "Q3 Pricing Review")
ID_VN = next(w["id"] for w in ws_all if w["name"] == "Vendor Negotiation")
ID_PL = next(w["id"] for w in ws_all if w["name"] == "Product Launch")

# ── TEST 6: Mixed Scenario ───────────────────────────────────
section("TEST 6: Mixed — 2 new, delete 1 seeded + delete 1 new")

ws_x = create_workspace("New Workspace X")
ws_y = create_workspace("New Workspace Y")
ID_X, ID_Y = ws_x["id"], ws_y["id"]

status, body = delete_workspace(ID_VN)
check("Delete Vendor Negotiation (seeded) returned 200", status == 200, f"status={status}")
validate_state(
    expected_ids=[ID_Q3, ID_PL, ID_X, ID_Y],
    expected_names=["Q3 Pricing Review", "Product Launch", "New Workspace X", "New Workspace Y"],
    deleted_id=ID_VN, deleted_name="Vendor Negotiation",
    tag="Mixed: delete seeded VN"
)

status, body = delete_workspace(ID_X)
check("Delete New Workspace X returned 200", status == 200, f"status={status}")
validate_state(
    expected_ids=[ID_Q3, ID_PL, ID_Y],
    expected_names=["Q3 Pricing Review", "Product Launch", "New Workspace Y"],
    deleted_id=ID_X, deleted_name="New Workspace X",
    tag="Mixed: delete new X"
)

# ── TEST 7: Nonexistent ID ───────────────────────────────────
section("TEST 7: Delete nonexistent ID returns 404")

fake_id = "00000000-0000-0000-0000-000000000099"
status, body = delete_workspace(fake_id)
check("Delete nonexistent ID returns 404", status == 404, f"status={status}")
current_count = len(get_workspaces_api())
check("DB unchanged after fake delete (3 workspaces remain)", current_count == 3,
      f"found={current_count}")

# ── FINAL DB UNIQUENESS CHECK ────────────────────────────────
section("FINAL: DB-level ID uniqueness check")

reseed()
db = load_db()
db_ids = [w["id"] for w in db.get("workspaces", [])]
check("All IDs in db.json are unique after final reseed",
      len(db_ids) == len(set(db_ids)), f"ids={db_ids}")
check("db.json contains exactly 3 workspaces", len(db_ids) == 3, f"found={len(db_ids)}")

# ── SUMMARY ──────────────────────────────────────────────────
section("REGRESSION TEST SUMMARY")

total  = len(results)
passed = sum(1 for r in results if r[0] == PASS)
failed = sum(1 for r in results if r[0] == FAIL)

print(f"\n  Total:  {total}")
print(f"  Passed: {passed}")
print(f"  Failed: {failed}")

if failed > 0:
    print("\n  FAILED CHECKS:")
    for status, label, detail in results:
        if status == FAIL:
            print(f"    [FAIL] {label}" + (f" -- {detail}" if detail else ""))
else:
    print("\n  ALL CHECKS PASSED. No regression detected.")

print()
sys.exit(0 if failed == 0 else 1)
