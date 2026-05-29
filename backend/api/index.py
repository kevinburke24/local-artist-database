import sys
import os
import types

# When Vercel deploys from backend/ as root, this file is at /var/task/api/index.py
# and the backend package contents are at /var/task/.
# We add that to sys.path and create a 'backend' package alias so all
# the existing `from backend.xxx import yyy` imports resolve correctly.
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

if "backend" not in sys.modules:
    backend_pkg = types.ModuleType("backend")
    backend_pkg.__path__ = [project_root]
    backend_pkg.__package__ = "backend"
    sys.modules["backend"] = backend_pkg

from app import app  # noqa: E402
