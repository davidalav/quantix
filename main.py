#!/usr/bin/env python3

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
        {"name": "First script",  "done": True},
        {"name": "Dockerfile",    "done": False},
        {"name": "CI pipeline",   "done": False},
    ]

    print(f"=== Статус {project} ===")
    remaining = summarize(components)

    if remaining == 0:
        print("All components ready!")
    else:
        print(f"{remaining} component(s) still to build. Onward.")

    exit(remaining)


if __name__ == "__main__":
    main()