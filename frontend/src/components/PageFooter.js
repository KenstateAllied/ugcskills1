import { useMemo } from "react";
import { Link } from "react-router-dom";

const footerHighlights = [
  "Verified professional records",
  "Responsive client presentation",
  "County-wide search by skill and ward",
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://web.facebook.com/ugcounty/?_rdc=1&_rdr",
    icon: "facebook",
  },
  {
    label: "X",
    href: "https://x.com/UGC_TheChampion",
    icon: "x",
  },
  {
    label: "LinkedIn",
    href: "https://ke.linkedin.com/company/county-government-of-uasin-gishu",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/reel/DVWOlHnDMdg/",
    icon: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@countygovernmentofuasingis6548/videos",
    icon: "youtube",
  },
];

const logoFallback = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = "/uasin-gishu-logo.svg";
};

function SocialIcon({ type }) {
  switch (type) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M13.2 21v-7.16h2.42l.36-2.79H13.2V9.27c0-.81.23-1.36 1.39-1.36H16V5.42c-.25-.04-1.1-.1-2.1-.1-2.08 0-3.5 1.27-3.5 3.62v2.11H8v2.79h2.4V21h2.8Z"
            fill="currentColor"
          />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M5 4h3.36l4.31 5.82L17.45 4H20l-6.17 7.03L20.5 20h-3.36l-4.65-6.24L6.95 20H4.4l6.6-7.53L5 4Z"
            fill="currentColor"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M6.53 8.47a1.73 1.73 0 1 1 0-3.46 1.73 1.73 0 0 1 0 3.46ZM8 10H5v9h3v-9Zm4.75 0H10v9h3v-4.78c0-2.65 3.4-2.87 3.4 0V19h3v-5.83c0-4.54-5.06-4.37-6.4-2.14V10Z"
            fill="currentColor"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M7.25 3h9.5A4.25 4.25 0 0 1 21 7.25v9.5A4.25 4.25 0 0 1 16.75 21h-9.5A4.25 4.25 0 0 1 3 16.75v-9.5A4.25 4.25 0 0 1 7.25 3Zm0 1.7A2.55 2.55 0 0 0 4.7 7.25v9.5A2.55 2.55 0 0 0 7.25 19.3h9.5a2.55 2.55 0 0 0 2.55-2.55v-9.5A2.55 2.55 0 0 0 16.75 4.7h-9.5Zm10.1 1.27a1.08 1.08 0 1 1 0 2.16 1.08 1.08 0 0 1 0-2.16ZM12 7.65A4.35 4.35 0 1 1 7.65 12 4.35 4.35 0 0 1 12 7.65Zm0 1.7A2.65 2.65 0 1 0 14.65 12 2.65 2.65 0 0 0 12 9.35Z"
            fill="currentColor"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M21.58 8.18a2.96 2.96 0 0 0-2.08-2.1C17.63 5.6 12 5.6 12 5.6s-5.63 0-7.5.48a2.96 2.96 0 0 0-2.08 2.1A31.1 31.1 0 0 0 2 12a31.1 31.1 0 0 0 .42 3.82 2.96 2.96 0 0 0 2.08 2.1c1.87.48 7.5.48 7.5.48s5.63 0 7.5-.48a2.96 2.96 0 0 0 2.08-2.1A31.1 31.1 0 0 0 22 12a31.1 31.1 0 0 0-.42-3.82ZM10.2 15.02V8.98L15.5 12l-5.3 3.02Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function PageFooter({ className = "" }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAuthenticated = Boolean(token);
  const homePath = isAuthenticated ? (role === "admin" ? "/ProfessionalsList" : "/IndustryList") : "/login";

  const quickLinks = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { to: "/login", label: "Home" },
        { to: "/register", label: "Register" },
      ];
    }

    if (role === "admin") {
      return [
        { to: "/ProfessionalsList", label: "Directory" },
        { to: "/create-professional", label: "Add Profile" },
        { to: "/IndustryList", label: "Industry View" },
      ];
    }

    return [{ to: "/IndustryList", label: "Industry View" }];
  }, [isAuthenticated, role]);

  return (
    <footer className={`site-footer ${className}`.trim()}>
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand-panel">
            <Link className="site-footer-brand" to={homePath}>
              <span className="site-footer-logo-wrap">
                <img
                  className="site-footer-logo"
                  src="/uasin-gishu-logo.jpg"
                  alt="County Government of Uasin Gishu logo"
                  onError={logoFallback}
                />
              </span>

              <span className="site-footer-brand-copy">
                <span className="site-footer-kicker">County Government of Uasin Gishu</span>
                <strong className="site-footer-title">Skills Databank Portal</strong>
                <span className="site-footer-copy">
                  A more polished county-facing experience for presenting local professionals,
                  skills, and service capacity with confidence.
                </span>
              </span>
            </Link>

            <div className="site-footer-pill-row">
              {footerHighlights.map((item) => (
                <span key={item} className="site-footer-pill">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="site-footer-column">
            <p className="site-footer-section-title">Quick Access</p>
            <nav className="site-footer-links" aria-label="Footer quick links">
              {quickLinks.map((link) => (
                <Link key={`${link.to}-${link.label}`} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="site-footer-column site-footer-column-contact">
            <div className="site-footer-motto">The Champions</div>
            <p className="site-footer-section-title">Connect With The County</p>

            <div className="site-footer-meta">
              <span>Eldoret, Kenya</span>
              <a href="mailto:info@uasingishu.go.ke">info@uasingishu.go.ke</a>
              <span>05320160000</span>
            </div>

            <div className="site-footer-social" aria-label="County social media links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="site-social-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                >
                  <span className="site-social-icon">
                    <SocialIcon type={link.icon} />
                  </span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>&copy; {new Date().getFullYear()} County Government of Uasin Gishu</span>
          <span>
            Managed and maintained by{" "}
            <span className="site-footer-dev-link">County ICT and Innovation</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
