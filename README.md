# Complexity AI Landing Page

A modern, Notion-inspired landing page for Complexity AI - a startup focused on automating laboratory workflows through AI and data collection.

## Features

- **Modern Design**: Clean, Notion-inspired interface with smooth animations
- **Responsive**: Optimized for all devices (desktop, tablet, mobile)
- **Interactive Elements**: Floating cards, smooth scrolling, and engaging animations
- **Call-to-Action**: Direct integration with CVAT platform for data contribution
- **Contact Form**: Interactive contact form with validation and feedback

## Structure

```
complexity-landing/
├── index.html          # Main HTML file
├── styles.css          # CSS styles with Notion-inspired design
├── script.js           # JavaScript for interactions and animations
└── README.md           # This file
```

## Key Sections

1. **Hero Section**: Eye-catching introduction with floating animation cards
2. **About Section**: Overview of current focus (data collection) and future plans
3. **Vision Section**: Roadmap and timeline for lab automation goals
4. **Contribution Section**: Call-to-action for CVAT platform participation
5. **Contact Section**: Contact form and company information

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: Interactive behaviors and form handling
- **Font Awesome**: Icons throughout the interface
- **Google Fonts**: Inter font family for clean typography

## Deployment

This is a static website that can be deployed to any web hosting service:

### Option 1: Simple HTTP Server (for testing)
```bash
# Navigate to the project directory
cd complexity-landing

# Start a simple HTTP server (Python 3)
python -m http.server 8000

# Or with Node.js
npx http-server
```

### Option 2: Deploy to Netlify
1. Drag and drop the entire folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your Git repository for automatic deployments

### Option 3: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 4: Deploy to GitHub Pages
1. Push the code to a GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

## Customization

### Colors
The color scheme is defined in CSS custom properties at the top of `styles.css`. You can easily customize:
- Primary colors
- Gray scale
- Typography
- Spacing

### Content
- Update company information in `index.html`
- Modify the vision timeline and roadmap
- Customize the contact form fields
- Update social links and contact information

### Animation
- Adjust animation timing in `script.js`
- Modify floating card behaviors
- Customize scroll effects and transitions

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Contact

For questions about this landing page or Complexity AI:
- Email: contact@complexity-ai.com
- Website: [Your domain here]

---

Built with ❤️ for the future of laboratory automation.
