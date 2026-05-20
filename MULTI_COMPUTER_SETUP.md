# Multi-Computer Setup

Use this workflow to open this Codex app project from another computer.

## On the second computer

1. Install Git:
   https://git-scm.com/downloads

2. Open Terminal, PowerShell, or Git Bash.

3. Choose where you want the project saved, then run:

```bash
git clone https://github.com/chrisbryanpeters-tech/residential-estimating-system.git
cd residential-estimating-system
```

4. Open the `residential-estimating-system` folder in the Codex desktop app.

5. Install dependencies if the project needs them:

```bash
npm install
```

6. Start the app if it is a web app:

```bash
npm run dev
```

## When switching computers

Before leaving one computer:

```bash
git add .
git commit -m "Progress update"
git push
```

On the other computer:

```bash
git pull
```

## Important

- Do not commit `.env` files or secret keys.
- Make sure `.env` is listed in `.gitignore`.
- Codex chat history may not fully sync between computers, but the project code will sync through GitHub.
