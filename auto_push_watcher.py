import subprocess
import time
import os
import sys

GIT_BIN = r"C:\Users\Navirex\AppData\Local\Programs\Git\cmd\git.exe"
REPO_DIR = os.path.dirname(os.path.abspath(__file__))

def run_git(args):
    try:
        res = subprocess.run([GIT_BIN] + args, cwd=REPO_DIR, capture_output=True, text=True)
        return res.returncode, res.stdout.strip(), res.stderr.strip()
    except Exception as e:
        return 1, '', str(e)

def auto_push():
    print(f"[{time.strftime('%X')}] Checking for changes in {REPO_DIR}...")
    run_git(["add", "."])
    
    code, diff_out, _ = run_git(["status", "--porcelain"])
    if not diff_out:
        print(f"[{time.strftime('%X')}] Working tree clean. No changes.")
        return
    
    print(f"[{time.strftime('%X')}] Changes detected! Committing...")
    msg = f"Auto-sync: {time.strftime('%Y-%m-%d %H:%M:%S')}"
    run_git(["commit", "-m", msg])
    
    print(f"[{time.strftime('%X')}] Pushing to remote GitHub repository...")
    push_code, push_out, push_err = run_git(["push", "origin", "main"])
    if push_code == 0:
        print(f"[{time.strftime('%X')}] Successfully pushed to GitHub!")
    else:
        print(f"[{time.strftime('%X')}] Push failed or remote not configured yet: {push_err or push_out}")

if __name__ == '__main__':
    print("=" * 60)
    print("  ScholaRise Poster Studio - Automated Git Push Watcher")
    print("=" * 60)
    
    # Check remote origin
    code, origin_url, _ = run_git(["remote", "get-url", "origin"])
    if code != 0 or not origin_url:
        print("[!] No remote origin configured yet.")
        print("    Run: git remote add origin <your-github-repo-url>")
    else:
        print(f"[OK] Remote GitHub repository: {origin_url}")
        
    print("\nWatching directory for changes (checking every 30 seconds)...")
    print("Press Ctrl+C to stop.\n")
    
    while True:
        try:
            auto_push()
            time.sleep(30)
        except KeyboardInterrupt:
            print("\nAuto-push watcher stopped.")
            break
