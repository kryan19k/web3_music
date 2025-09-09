# 🎨 Theme Picker Component

Enhanced three-theme toggle system for PAGS Music Platform with smooth transitions and clear visual feedback.

## Components

### `ThemeToggle`
Located: `src/components/ui/ThemeToggle.tsx`

A reusable theme toggle component with multiple display variants.

#### Variants

##### `dropdown` - Clean Select Menu *(Recommended)*
- Small dropdown with all theme options visible
- Direct selection instead of cycling
- Shows current theme icon in trigger
- Perfect for navbar and mobile use

##### `default` - Full Featured Desktop
- Enhanced tooltip with theme progression
- Smooth icon transitions
- Visual theme cycle indicator
- Legacy cycling button variant

##### `minimal` - Simple Icon Button  
- Just the current theme icon
- Click to cycle themes
- Minimal footprint for tight spaces

##### `compact` - With Progress Dots
- Current theme icon + visual progress dots
- Shows Light → Dim → Dark progression
- Perfect for settings with space constraints

#### Props
```typescript
interface ThemeToggleProps {
  showTooltip?: boolean      // Show hover tooltip (default: true)
  variant?: 'default' | 'minimal' | 'compact'  // Display style
  className?: string         // Additional CSS classes
}
```

#### Usage Examples

```tsx
// Desktop navbar (recommended)
<ThemeToggle variant="dropdown" />

// Mobile menu 
<ThemeToggle variant="dropdown" className="w-[100px]" />

// Compact cycling button
<ThemeToggle variant="default" />

// Settings page (minimal)
<ThemeToggle variant="minimal" />
```

## Theme Cycling Logic

**Order**: Light → Dim → Dark → Light (repeats)

```typescript
const getNextTheme = () => {
  if (actualTheme === 'light') return 'dim'
  if (actualTheme === 'dim') return 'dark'
  return 'light'
}
```

## Visual Indicators

### Icons
- **Light**: `☀️` Sun icon (fully visible)
- **Dim**: `🌗` Half moon (partial fill, 40% opacity)
- **Dark**: `🌙` Moon icon (fully filled)

### Transitions
- **Duration**: 300ms for smooth feel
- **Easing**: CSS transitions with opacity, scale, and rotation
- **States**: Scale 0→1, Rotation 90°→0°, Opacity 0→1

### Tooltips (Desktop)
```
Current: Light
Light → Dim → Dark
```

## Integration Points

### Navbar (`src/components/layout/Navbar.tsx`)
- Desktop: Full featured variant with enhanced tooltip
- Mobile: Compact variant with progress dots

### Profile Settings (`src/components/pageComponents/profile/Settings/index.tsx`)
- Dropdown selector with all theme options
- Icons and descriptions for each theme

### Theme Context (`src/contexts/ThemeContext.tsx`)
- Supports all four themes: light, dim, dark, system
- Persistent localStorage saving
- System preference detection

## Accessibility Features

- **ARIA Labels**: Screen reader friendly descriptions
- **Keyboard Support**: Full keyboard navigation
- **High Contrast**: Maintained across all themes
- **Focus Indicators**: Clear focus states for keyboard users

## Theme Information Export

The component also exports `themeInfo` object for use in settings and documentation:

```typescript
export const themeInfo = {
  light: {
    name: 'Light',
    description: 'Bright and clean for well-lit environments',
    suitable: 'Daytime, bright offices, outdoor use'
  },
  dim: {
    name: 'Dim', 
    description: 'Comfortable middle-ground for extended use',
    suitable: 'Evening, dimly lit rooms, long sessions'
  },
  dark: {
    name: 'Dark',
    description: 'High contrast for night viewing', 
    suitable: 'Night time, dark rooms, OLED displays'
  }
}
```

## Best Practices

### For Developers
- Use `default` variant for primary navigation
- Use `compact` for mobile/constrained spaces
- Use `minimal` when space is extremely limited
- Always test transitions in all three themes

### For Users
- **Single Click**: Cycles to next theme in sequence
- **Hover (Desktop)**: Shows current theme and progression
- **Visual Feedback**: Clear indicators of current theme
- **Consistent**: Same behavior across desktop and mobile

---

*The enhanced theme picker provides intuitive three-way theme switching with clear visual feedback and smooth animations, making it easy for users to find their perfect viewing experience.*
