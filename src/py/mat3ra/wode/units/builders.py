from __future__ import annotations

from typing import Any, Dict

from mat3ra.standata.applications import ApplicationStandata


def build_execution_unit_config(config: Dict[str, Any]) -> Dict[str, Any]:
    app = config.get("application") if isinstance(config.get("application"), dict) else {}
    exe = config.get("executable") if isinstance(config.get("executable"), dict) else {}

    app_name = app.get("name")
    exe_name = exe.get("name")
    if not app_name or not exe_name or exe.get("results"):
        return config

    exe_full = ApplicationStandata.get_executable_flavor_map_by_application_name(app_name).get(exe_name) or {}
    results = exe_full.get("results") if isinstance(exe_full, dict) else None
    if not results:
        return config

    updated = dict(config)
    updated["executable"] = {**exe, "results": results}
    return updated
