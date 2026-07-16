const fs = require('fs');
let code = fs.readFileSync('src/components/SubProjects.tsx', 'utf-8');

// 1. Update ProjectItem interface
code = code.replace(
  /liveUrl: string;/,
  `liveUrl: string;\n  liveUrl2?: string;\n  liveTitle1?: string;\n  liveTitle2?: string;`
);

// 2. Update ghost-node object
code = code.replace(
  /id: 'ghost-node',[\s\S]*?tag: 'GHOST_NODE_PORT_80',/,
  `id: 'ghost-node',
    title: 'GHOST NODE',
    subtitle: 'Autonomous Poetic Presence',
    liveUrl: 'https://melodious-zabaione-c5fb66.netlify.app/',
    liveUrl2: 'https://ghost-771-archive.merrypranxter.chatgpt.site/',
    liveTitle1: 'GHOST_INTERACTIVE',
    liveTitle2: 'GHOST_ARCHIVE',
    description: 'A sensory poetic stream environment designed with haunting text fragments, feedback noise, and interactive frequency generators, split alongside its full conceptual archive.',
    tag: 'GHOST_NODE_PORT_80',`
);

// 3. Update buildUrl
code = code.replace(
  /const buildUrl = \(proj: ProjectItem\) => \{[\s\S]*?return proj\.liveUrl;\n  \};/,
  `const buildUrl = (proj: ProjectItem, urlOverride?: string) => {
    const targetUrl = urlOverride || proj.liveUrl;
    if (proj.aiPowered && geminiKey) {
      const sep = targetUrl.includes('?') ? '&' : '?';
      return \`\${targetUrl}\${sep}apiKey=\${encodeURIComponent(geminiKey)}\`;
    }
    return targetUrl;
  };`
);

// 4. Update iframe rendering
code = code.replace(
  /\{isLoaded \? \([\s\S]*?<iframe[\s\S]*?\/>\n                  <\/div>\n                \) : \(/,
  `{isLoaded ? (
                  <div className={\`relative bg-black border-2 overflow-hidden \${isMaxed ? 'aspect-[16/9] min-h-[420px]' : 'aspect-video'} \${proj.liveUrl2 ? 'flex flex-col md:flex-row' : ''}\`} style={{ borderColor: proj.soft }}>
                    {crtFilter && <div className="cab-framebay-scan" />}
                    {proj.liveUrl2 ? (
                      <>
                        <div className="flex-1 relative border-b md:border-b-0 md:border-r border-zinc-900/50 flex flex-col">
                          <div className="text-[9px] font-mono font-bold text-center bg-zinc-900/40 text-zinc-400 py-1 uppercase">{proj.liveTitle1}</div>
                          <iframe
                            key={\`\${proj.id}-1-\${iframeKey}-\${smartArmed ? 'smart' : 'dumb'}\`}
                            src={buildUrl(proj)}
                            title={\`\${proj.title} Live Node 1\`}
                            className="w-full flex-1 border-0 bg-black relative z-10"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          />
                        </div>
                        <div className="flex-1 relative flex flex-col">
                          <div className="text-[9px] font-mono font-bold text-center bg-zinc-900/40 text-zinc-400 py-1 uppercase">{proj.liveTitle2}</div>
                          <iframe
                            key={\`\${proj.id}-2-\${iframeKey}-\${smartArmed ? 'smart' : 'dumb'}\`}
                            src={buildUrl(proj, proj.liveUrl2)}
                            title={\`\${proj.title} Live Node 2\`}
                            className="w-full flex-1 border-0 bg-black relative z-10"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          />
                        </div>
                      </>
                    ) : (
                      <iframe
                        key={\`\${proj.id}-\${iframeKey}-\${smartArmed ? 'smart' : 'dumb'}\`}
                        src={buildUrl(proj)}
                        title={\`\${proj.title} Live Node\`}
                        className="w-full h-full border-0 bg-black relative z-10"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      />
                    )}
                  </div>
                ) : (`
);

// 5. Update NEW TAB link
code = code.replace(
  /<a\s*href=\{buildUrl\(proj\)\}[\s\S]*?<\/a>/,
  `{proj.liveUrl2 ? (
                    <>
                      <a
                        href={buildUrl(proj)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playChime('sine', 1.3)}
                        className="cab-ctl"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> \${proj.liveTitle1} 🚀
                      </a>
                      <a
                        href={buildUrl(proj, proj.liveUrl2)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playChime('sine', 1.3)}
                        className="cab-ctl"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> \${proj.liveTitle2} 🚀
                      </a>
                    </>
                  ) : (
                    <a
                      href={buildUrl(proj)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => playChime('sine', 1.3)}
                      className="cab-ctl"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> NEW TAB 🚀
                    </a>
                  )}`
);

fs.writeFileSync('src/components/SubProjects.tsx', code);
