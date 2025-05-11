# Local LLM Chat

Local LLM Chat is a web application designed to connect and chat with locally hosted LLM (Large Language Model) instances. It also provides the ability to add tools and configure multiple MCP (Model Context Protocol) servers for enhanced functionality.

## Features

- **Chat with Locally Hosted LLM Models**: Interact seamlessly with your locally hosted language models.
- **Tool Configuration**: Add and configure tools to extend the capabilities of your LLM models.
- **MCP Server Management**: Set up and manage multiple MCP servers for diverse use cases.

## Project Structure

```
localchatbot
├── app
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings
│       └── page.tsx
├── components
│   ├── chat.tsx
│   ├── loading-dots.tsx
│   ├── message-content.tsx
│   ├── model-settings.tsx
│   ├── terminal-ball.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── tools-settings.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── hooks
│   ├── use-chat.ts
│   ├── use-mobile.tsx
│   ├── use-terminal.ts
│   └── use-toast.ts
├── lib
│   └── utils.ts
├── public
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── styles
│   └── globals.css
├── types
│   ├── chat.ts
│   └── global.d.ts
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MukeshAofficial/Local-LLM-Chat.git
   cd Local-LLM-Chat
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License.
