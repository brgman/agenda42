![IMG_0167](https://github.com/user-attachments/assets/d591138a-67da-49b9-b5ea-4b8d1d794911)

[![Docker Image CI/CD](https://github.com/brgman/agenda42/actions/workflows/docker-image.yml/badge.svg?branch=master)](https://github.com/brgman/agenda42/actions/workflows/docker-image.yml)

## Manage slots, check evals, history and events. Your [agenda42.fr](https://agenda42.fr) ✨

The project is built on [**Next.js 14.0.4**](https://github.com/vercel/next.js) with [**TypeScript**](https://github.com/microsoft/TypeScript) for robust server-side rendering and static site generation, powered by [**React 18.2.0**](https://github.com/facebook/react) for dynamic UI components. It prominently features [**react-big-calendar**](https://github.com/jquense/react-big-calendar) for advanced calendar functionality, with state management handled by [**Redux**](https://github.com/reduxjs/redux) for efficient, scalable data flow.


## 🌟 Guide for Contributing, via Fork 🌟

Welcome to the project! We're super excited to have you here, and we can't wait to see your amazing contributions. Whether you're fixing a bug 🐛, adding a feature ✨, or improving documentation 📚, this guide will help you every step of the way. Feel free to jump in and contribute! 🚀

You can create [new issues](https://github.com/brgman/agenda42/issues/new)
or pick up tasks marked with [This task is currently unassigned and open for anyone to take!](https://github.com/brgman/agenda42/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22This%20task%20is%20currently%20unassigned%20and%20open%20for%20any%22)

---

### 1. **🍴 Fork the Repository**
First, let’s create your personal copy of the project:

1. Click the **Fork** button in the top-right corner. This will create a copy of the repository in **your own GitHub account**.
2. 🎉 Now you have your own version of the project to work on!

---

### 2. **💻 Clone Your Fork**
Let’s get the project onto your computer so you can start contributing:

1. Copy the URL of your forked repository (e.g., `https://github.com/<your-username>/agenda42.git`).
2. Open your terminal and type:
   ```bash
   git clone https://github.com/<your-username>/agenda42.git
   ```
3. Move into the project folder:
   ```bash
   cd agenda42
   ```
4. You’re all set to start working locally! 🎉

---

### 3. **🌿 Create a New Branch**
It’s best to work in a separate branch to keep your changes organized and isolated.

1. Create a new branch with a name that describes your work:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
2. Double-check that you’re in your new branch:
   ```bash
   git branch
   ```
3. You’re ready to go! 🛠️

---

### 4. **🛠️ Make Your Changes**
Let your creativity shine! 🌟 Make the changes you want—whether it’s fixing a bug, adding functionality, or improving the code.

1. Check what files you’ve modified:
   ```bash
   git status
   ```
2. Stage your changes to prepare them for commit:
   ```bash
   git add <file-name>
   # Or add everything:
   git add .
   ```
3. Commit your changes with a clear and friendly message:
   ```bash
   git commit -m "🌟 Added a cool new feature!"
   ```

---

### 5. **📤 Push Your Changes**
Let’s send your work to your forked repository on GitHub:

```bash
git push origin feature/my-awesome-feature
```

---

### 6. **🔄 Create a Pull Request to `master`**
This is the exciting part—sharing your changes with the team! 🎉

**Steps 1 through 5 might be automatic if you run the link from the terminal.** 🤖 

1. Go to your forked repository on GitHub.
2. Switch to your branch (`feature/my-awesome-feature`).
3. Click the **Compare & pull request** button.
4. In the Pull Request form:
   - Make sure the **Base repository** is the original repo (`brgman/agenda42`).
   - Set the **Base branch** to `master`.
   - Select your **Head branch** (`feature/my-awesome-feature`).
5. Add a title and description to explain your changes. Be creative! ✨


6. Click **Create pull request**, and voilà! Your changes are now up for review. 🎉

_Don't panic, the classic red **Review required** badge — totally normal, your code will be reviewed._ 🚀

---

### 7. **🔃 Keep Your Fork Updated**
As the project evolves, it’s important to keep your fork synchronized with the original repository:

1. Add the original repository as `upstream`:
   ```bash
   git remote add upstream https://github.com/brgman/agenda42.git
   ```
2. Fetch updates from the original repository:
   ```bash
   git fetch upstream
   ```
3. Merge the updates into your local `master` branch:
   ```bash
   git checkout master
   git merge upstream/master
   ```
4. Push the updated `master` to your fork:
   ```bash
   git push origin master
   ```

---

### 🎉 Thank You for Contributing!
Your contributions, no matter how big or small, make a huge difference to this project. 💖 Don’t be afraid to ask questions, share ideas, or even experiment. You’re part of something amazing, and we’re thrilled to have you on board. Let’s build something incredible together! 🚀

Happy coding! 💻✨
