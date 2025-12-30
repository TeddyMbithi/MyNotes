# Cybersecurity Portfolio - TeddyMbithi

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=for-the-badge&logo=github)](https://TeddyMbithi.github.io/MyNotes/)
[![CTF](https://img.shields.io/badge/CTF-Writeups-green?style=for-the-badge)](https://TeddyMbithi.github.io/MyNotes/)
[![Malware Analysis](https://img.shields.io/badge/Malware-Analysis-red?style=for-the-badge)](https://TeddyMbithi.github.io/MyNotes/)

A modern, interactive portfolio website showcasing CTF writeups, reverse engineering notes, and malware analysis.

**🌐 View the live portfolio:** [https://TeddyMbithi.github.io/MyNotes/](https://TeddyMbithi.github.io/MyNotes/)

## 🚀 Features

- **Modern Single-Page Design** - Smooth scrolling navigation with animated transitions
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - Toggle between themes with persistent preference storage
- **Interactive Cards** - Hover effects and smooth animations throughout
- **Fast Loading** - Optimized assets and minimal dependencies
- **Accessibility** - Keyboard navigation and ARIA labels for screen readers

## 📁 Repository Structure

```
MyNotes/
├── index.html          # Main portfolio HTML structure
├── styles.css          # CSS styling with responsive design
├── script.js           # JavaScript for interactivity
├── _config.yml         # GitHub Pages configuration
├── HTB/                # HackTheBox writeups
├── THM/                # TryHackMe writeups
├── RE/                 # Reverse Engineering challenges
├── CYBERSTUDENTS/      # CyberStudents platform writeups
├── MALWARE BABY/       # Malware analysis notes
└── images/             # Screenshots and diagrams
```

## 📚 Content Categories

- **HackTheBox (HTB)** - Detailed writeups from HTB challenges including Sherlocks investigations
- **TryHackMe (THM)** - Solutions and methodologies for THM rooms
- **Reverse Engineering (RE)** - Binary exploitation, buffer overflows, and assembly analysis
- **Malware Analysis** - Static and dynamic analysis techniques, PE headers, process injection
- **CyberStudents** - Challenge solutions covering cryptography and CTF fundamentals

## 🛠️ Local Development Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Local web server for testing

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/TeddyMbithi/MyNotes.git
   cd MyNotes
   ```

2. **Open the website**
   - Simply open `index.html` in your web browser, or
   - Use a local server for better testing:
   
   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```
   
   **Using Node.js:**
   ```bash
   npx http-server -p 8000
   # Then visit http://localhost:8000
   ```
   
   **Using VS Code:**
   - Install the "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

3. **Make changes**
   - Edit HTML in `index.html`
   - Modify styles in `styles.css`
   - Update functionality in `script.js`
   - Refresh browser to see changes

## 🚀 GitHub Pages Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment Steps
1. Ensure all changes are committed
2. Push to the main branch
3. Go to repository Settings → Pages
4. Select "main" branch as source
5. Site will be available at `https://TeddyMbithi.github.io/MyNotes/`

### Configuration
The `_config.yml` file contains GitHub Pages settings:
```yaml
theme: jekyll-theme-minimal
title: CTF Writeups & Notes
description: Cybersecurity notes, CTF writeups, and malware analysis by TeddyMbithi
show_downloads: true
```

## 🎨 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --accent-color: #e74c3c;
    /* ... more variables */
}
```

### Adding New Projects
Edit the projects section in `index.html`:
```html
<div class="project-card">
    <div class="card-icon"><i class="fas fa-icon"></i></div>
    <h3>Project Title</h3>
    <p>Project description</p>
    <div class="card-tags">
        <span class="tag">Tag1</span>
    </div>
    <a href="link" class="card-link">View Project</a>
</div>
```

### Modifying Theme Toggle
Theme preference is stored in `localStorage`. Toggle functionality is in `script.js`.

## 📝 Writeup Template

Use this template for new writeups:

```markdown
# Challenge Name

**Platform:** HTB/THM/etc  
**Difficulty:** Easy/Medium/Hard  
**Category:** Web/Pwn/Crypto/etc  

## Challenge Description
Brief description of the challenge

## Reconnaissance
Initial information gathering

## Solution
Step-by-step solution

## Flag
`flag{example}`

## Lessons Learned
Key takeaways and techniques
```

## 🔧 Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS variables and animations
- **Vanilla JavaScript** - No framework dependencies for lightweight performance
- **Font Awesome** - Icon library for visual elements
- **GitHub Pages** - Free hosting and deployment

## ⌨️ Keyboard Shortcuts

- **T** - Toggle dark/light theme
- **Escape** - Close mobile menu

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! If you find any issues or have suggestions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

- **GitHub:** [@TeddyMbithi](https://github.com/TeddyMbithi)
- **Website:** [https://TeddyMbithi.github.io/MyNotes/](https://TeddyMbithi.github.io/MyNotes/)

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Icons from [Font Awesome](https://fontawesome.com/)
- Hosted on [GitHub Pages](https://pages.github.com/)

---

## VS Code Setup (For Writeups)

Extensions installed for markdown editing:
- Markdown All in One (shortcuts, TOC, preview)
- Paste Image (Ctrl+Alt+V to paste screenshots)
- Markdown Preview Enhanced (better preview)

### Paste Image Settings
- Images auto-save to `images/` folder
- Use relative paths for GitHub compatibility
