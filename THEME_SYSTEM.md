# Premium Theme System - Documentation

## 🎨 Overview

The premium theme system allows premium users to toggle between **Dark** and **Light** themes. The themes use separate CSS variables so you can easily customize colors without modifying inline CSS throughout the codebase.

---

## 🌗 Theme Modes

### Dark Theme (Default)
- **Primary:** `#2C2C2C` (Dark gray background)
- **Secondary:** `#6495ED` (Cornflower blue accent)
- **Tertiary:** `#FFFFFF` (White text)

### Light Theme (Premium)
- **Primary:** `#FAF9F6` (Off-white background)
- **Secondary:** `#2C2C2C` (Dark gray text)
- **Tertiary:** `#6495ED` (Cornflower blue accent)

---

## 🎯 How It Works

### CSS Variables

The system uses separate CSS variables for each theme:

```css
/* Dark Theme Variables */
[data-premium-theme="dark"] {
    --color-primary-premium: #2C2C2C;
    --color-secondary-premium: #6495ED;
    --color-tertiary-premium: #FFFFFF;
}

/* Light Theme Variables */
[data-premium-theme="light"] {
    --color-primary-premium: #FAF9F6;
    --color-secondary-premium: #2C2C2C;
    --color-tertiary-premium: #6495ED;
}
```

### Theme Toggle

The toggle button appears in the header **only for logged-in premium users**:

```
[Theme Toggle] [User Email] [Dashboard] [Logout]
```

Clicking the toggle switches between dark and light themes instantly.

---

## 📁 File Structure

```
src/
├── app/
│   ├── globals.css                    # Theme CSS variables
│   ├── components/
│   │   ├── PremiumThemeProvider.tsx   # Theme context provider
│   │   ├── ThemeToggle.tsx            # Toggle button component
│   │   └── headerComponents/
│   │       └── UserMenu.tsx           # Includes theme toggle
│   └── layout.tsx                     # Wraps with theme provider
```

---

## 🎨 Using Theme Classes

### Option 1: Premium Classes (Recommended)

These classes automatically switch based on the selected theme:

```jsx
<div className="bg-primary-premium text-tertiary-premium">
  <h1 className="text-secondary-premium">Hello</h1>
  <div className="border border-secondary-premium">
    Content
  </div>
</div>
```

**Available Classes:**
- `bg-primary-premium`, `bg-secondary-premium`, `bg-tertiary-premium`
- `text-primary-premium`, `text-secondary-premium`, `text-tertiary-premium`
- `border-primary-premium`, `border-secondary-premium`, `border-tertiary-premium`

### Option 2: Specific Theme Classes

Use these if you want a specific theme regardless of toggle:

```jsx
<div className="bg-primary-dark text-tertiary-light">
  {/* Always uses dark theme primary, light theme tertiary */}
</div>
```

**Dark Theme Classes:**
- `bg-primary-dark`, `bg-secondary-dark`, `bg-tertiary-dark`
- `text-primary-dark`, `text-secondary-dark`, `text-tertiary-dark`
- `border-primary-dark`, `border-secondary-dark`, `border-tertiary-dark`

**Light Theme Classes:**
- `bg-primary-light`, `bg-secondary-light`, `bg-tertiary-light`
- `text-primary-light`, `text-secondary-light`, `text-tertiary-light`
- `border-primary-light`, `border-secondary-light`, `border-tertiary-light`

---

## 🔧 Customizing Colors

To change theme colors, **only edit** `src/app/globals.css`:

### Change Dark Theme Colors

```css
[data-premium-theme="dark"] {
    --color-primary-premium: #YOUR_COLOR;
    --color-secondary-premium: #YOUR_COLOR;
    --color-tertiary-premium: #YOUR_COLOR;
}
```

### Change Light Theme Colors

```css
[data-premium-theme="light"] {
    --color-primary-premium: #YOUR_COLOR;
    --color-secondary-premium: #YOUR_COLOR;
    --color-tertiary-premium: #YOUR_COLOR;
}
```

**That's it!** The changes will apply everywhere you use `-premium` classes.

---

## 💡 Example Usage

### Dashboard Page

```jsx
export default function DashboardPage() {
  return (
    <div className="text-tertiary-premium py-5 lg:py-10">
      {/* Card with premium theme */}
      <div className="border border-primary-premium bg-primary-premium bg-opacity-50 p-6">
        <h2 className="text-2xl font-bold text-secondary-premium">
          Welcome!
        </h2>
      </div>

      {/* Accent section */}
      <div className="border border-secondary-premium bg-secondary-premium bg-opacity-10 p-6">
        <p className="text-primary-premium">Content</p>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing the Theme Toggle

### Test 1: Toggle Between Themes
1. Login with premium account
2. Click theme toggle in header (🌙/☀️ icon)
3. ✅ Background should change from dark to light
4. ✅ Text should remain readable
5. ✅ Accent colors should update

### Test 2: Persistence
1. Toggle to light theme
2. Refresh page
3. ✅ Theme should remain light
4. ✅ Stored in localStorage

### Test 3: Free Tier
1. Logout
2. Browse free content
3. ✅ Theme toggle should NOT appear
4. ✅ Always uses dark theme

---

## 🎨 Color Reference

### Dark Theme
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#2C2C2C` | Backgrounds, borders |
| Secondary | `#6495ED` | Buttons, accents, links |
| Tertiary | `#FFFFFF` | Text, icons |

### Light Theme
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#FAF9F6` | Backgrounds |
| Secondary | `#2C2C2C` | Text, borders |
| Tertiary | `#6495ED` | Accents, buttons |

---

## 🔐 Premium-Only Feature

The theme toggle **only appears** when:
- User is logged in
- User has premium subscription (paymentStatus = "completed")

Free users always see the dark theme.

---

## 📊 Theme State Management

### Context API

Theme state is managed via React Context:

```typescript
// Access theme in any component
const { theme, toggleTheme, setTheme } = usePremiumTheme();

// theme: "dark" | "light"
// toggleTheme: () => void
// setTheme: (theme: "dark" | "light") => void
```

### LocalStorage

Theme preference is saved in localStorage:
- Key: `premiumTheme`
- Value: `"dark"` or `"light"`
- Persists across sessions

---

## ⚠️ Important Notes

1. **Don't modify inline CSS** in components
   - Use theme classes instead
   - Edit colors only in `globals.css`

2. **Test both themes** when adding new premium pages
   - Dark theme should work
   - Light theme should work
   - Text should be readable in both

3. **Free tier uses default theme**
   - No theme toggle
   - Always dark theme
   - No access to premium theme classes

---

## 🎯 Quick Reference

### Want to change ALL dark theme colors?
Edit in `globals.css`:
```css
[data-premium-theme="dark"] {
    --color-primary-premium: #NEW_COLOR;
    --color-secondary-premium: #NEW_COLOR;
    --color-tertiary-premium: #NEW_COLOR;
}
```

### Want to change ALL light theme colors?
Edit in `globals.css`:
```css
[data-premium-theme="light"] {
    --color-primary-premium: #NEW_COLOR;
    --color-secondary-premium: #NEW_COLOR;
    --color-tertiary-premium: #NEW_COLOR;
}
```

### Want to use theme colors in a new component?
Use premium classes:
```jsx
<div className="bg-primary-premium text-tertiary-premium border border-secondary-premium">
```

---

**Happy Theming! 🎨**
