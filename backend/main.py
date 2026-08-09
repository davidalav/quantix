#!/usr/bin/env python3

import os
import uvicorn
from fastapi import FastAPI

from routes import router
from api.crawlerRoute import router as crawler_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(router)
app.include_router(
    crawler_router,
    prefix="/api",
    tags=["crawler"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def summarize(components):
    not_ready = 0

    for item in components:
        name = item["name"]

        if item["done"]:
            print(f"  [x] {name} — ready")
        else:
            print(f"  [ ] {name} — TODO")
            not_ready += 1

    return not_ready


def main():
    project = "Quantix"

    components = [
        {"name": "Idea & README", "done": True},
        {"name": "First script", "done": True},
        {"name": "Dockerfile", "done": False},
        {"name": "CI pipeline", "done": False},
    ]

    print(f"=== Status {project} ===")

    remaining = summarize(components)

    if remaining == 0:
        print("All components ready!")
    else:
        print(f"{remaining} component(s) still to build. Onward.")

    exit(remaining)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )