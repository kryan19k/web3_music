# 🎨 PAGS Theme System

PAGS Music Platform features a comprehensive three-theme system designed to provide the perfect viewing experience for any lighting condition or user preference.

## Available Themes

### 🌞 **Light Theme**
- **Best for**: Bright environments, daytime use
- **Colors**: Clean whites, light grays, dark text
- **Use case**: Office environments, outdoor use, well-lit rooms

### 🌙 **Dim Theme** *(DEFAULT)*
- **Best for**: Low-light environments, extended viewing sessions
- **Colors**: Medium grays, comfortable contrast
- **Use case**: Evening listening, dimly lit rooms, reducing eye strain
- **Inspired by**: Twitter's Dim mode, Discord's dark mode
- **Why Default**: Perfect balance of comfort and readability

### 🌚 **Dark Theme**
- **Best for**: Night use, OLED displays, minimal light
- **Colors**: Deep blacks, high contrast
- **Use case**: Night time, dark rooms, battery saving on OLED screens

### 🖥️ **System Theme**
- **Best for**: Automatic adaptation to OS preferences
- **Behavior**: Follows your device's system theme setting
- **Fallback**: Uses system preference (light/dark only)

## How to Switch Themes

### Quick Toggle (Navbar)
Click the theme toggle button in the navbar to cycle through themes:
**Light → Dim → Dark → Light**

### Mobile Menu
Use the theme toggle in the mobile menu with visual theme indicator.

### Profile Settings
Go to **Profile → Settings → Preferences** for a detailed theme selector with icons and descriptions.

## Theme Implementation

### CSS Variables
Each theme uses CSS custom properties for consistent theming:

```css
:root { /* Light theme variables */ }
.dim { /* Dim theme variables */ }
.dark { /* Dark theme variables */ }
```

### Tailwind Integration
Use theme-specific classes in your components:

```tsx
// Multi-theme responsive styling
<div className="bg-background text-foreground 
                light:border-gray-200 
                dim:border-gray-600 
                dark:border-gray-800">
  Content adapts to current theme
</div>
```

### React Context
Access current theme in components:

```tsx
import { useTheme } from '@/src/contexts/ThemeContext'

function MyComponent() {
  const { theme, actualTheme, setTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {actualTheme}</p>
      <button onClick={() => setTheme('dim')}>
        Switch to Dim
      </button>
    </div>
  )
}
```

## Design Philosophy

### **Progressive Enhancement**
- Light → Dim → Dark represents increasing darkness
- Each theme provides optimal contrast for its environment
- Smooth transitions between themes

### **Music-First Design**
- Dim theme reduces eye strain during long listening sessions
- Dark theme provides immersive experience for album art
- Light theme ensures readability in all conditions

### **Accessibility**
- High contrast ratios maintained across all themes
- Clear visual hierarchy preserved
- Support for system preferences

## Technical Details

### Color Palette

| Element | Light | Dim | Dark |
|---------|-------|-----|------|
| Background | `hsl(0 0% 100%)` | `hsl(217.2 15% 15%)` | `hsl(222.2 84% 4.9%)` |
| Foreground | `hsl(222.2 84% 4.9%)` | `hsl(210 40% 92%)` | `hsl(210 40% 98%)` |
| Card | `hsl(0 0% 100%)` | `hsl(217.2 15% 18%)` | `hsl(222.2 84% 4.9%)` |
| Border | `hsl(214.3 31.8% 91.4%)` | `hsl(217.2 20% 25%)` | `hsl(217.2 32.6% 17.5%)` |

### Performance
- CSS variables enable instant theme switching
- No JavaScript recalculation required
- Tailwind purges unused theme variants
- Local storage persistence

## Default Theme Choice

**Dim theme** is set as the default for PAGS Music Platform because:
- **Eye Comfort**: Reduces strain during long listening sessions
- **Universal Appeal**: Works well in most lighting conditions
- **Music Focus**: Provides immersive experience without harsh contrasts
- **Modern Standard**: Follows popular apps like Discord, Twitter, Spotify
- **Battery Friendly**: Better than light theme on OLED displays

## Best Practices

### For Developers
- Always test components in all three themes
- Use semantic color variables instead of hardcoded colors
- Leverage Tailwind's theme variants for conditional styling
- Ensure proper contrast ratios

### For Users
- **Default Experience**: Dim theme provides optimal comfort
- **Bright environments**: Switch to Light theme
- **Dark rooms/night**: Switch to Dark theme
- **Automatic**: Set System theme for OS integration

---

*The dim theme provides the perfect middle ground between light and dark, offering reduced eye strain without the high contrast of full dark mode.*
