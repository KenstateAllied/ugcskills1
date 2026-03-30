import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const THEME_STORAGE_KEY = "portal-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const logoFallback = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = "/uasin-gishu-logo.svg";
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(getInitialTheme);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAuthenticated = Boolean(token);
  const homePath = isAuthenticated ? (role === "admin" ? "/ProfessionalsList" : "/IndustryList") : "/login";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const syncHeaderState = () => {
      setIsScrolled(window.scrollY > 10);
    };

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncHeaderState);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { to: "/login", label: "Home", match: ["/login"] },
        { to: "/register", label: "Register", match: ["/register"] },
      ];
    }

    if (role === "admin") {
      return [
        { to: "/ProfessionalsList", label: "Directory", match: ["/ProfessionalsList"] },
        {
          to: "/create-professional",
          label: "Add Profile",
          match: ["/create-professional", "/update-professional"],
        },
        { to: "/IndustryList", label: "Industry View", match: ["/IndustryList"] },
      ];
    }

    return [{ to: "/IndustryList", label: "Industry View", match: ["/IndustryList"] }];
  }, [isAuthenticated, role]);

  const portalSummary = useMemo(() => {
    if (!isAuthenticated) {
      return "A client-ready county portal for showcasing verified skills and service capacity.";
    }

    if (role === "admin") {
      return "Manage, update, and present county professional records with a cleaner digital experience.";
    }

    return "Search professionals by industry, location, and skill with a faster, clearer interface.";
  }, [isAuthenticated, role]);

  const statusText = !isAuthenticated
    ? "Client-ready portal"
    : role === "admin"
      ? "Admin workspace live"
      : "Directory access live";

  const isLinkActive = (link) =>
    link.match.some((pattern) => location.pathname === pattern || location.pathname.startsWith(`${pattern}/`));

  const handleAction = () => {
    if (isAuthenticated) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    navigate("/login");
  };

  return (
    <header className={`site-header${isScrolled ? " scrolled" : ""}${isMenuOpen ? " menu-open" : ""}`}>
      <div className="site-header-topline">
        <div className="site-header-topline-inner">
          <span className="site-topline-pill">
            <span className="site-topline-dot" aria-hidden="true" />
            Digital County Service
          </span>
          <p className="site-topline-copy">{portalSummary}</p>
        </div>
      </div>

      <div className="site-header-inner">
        <Link className="site-brand" to={homePath}>
          <span className="site-logo-wrap">
            <img
              className="site-logo"
              src="/uasin-gishu-logo.jpg"
              alt="County Government of Uasin Gishu logo"
              onError={logoFallback}
            />
          </span>

          <span className="site-brand-text">
            <span className="site-brand-top">County Government of Uasin Gishu</span>
            <span className="site-brand-bottom">Skills Databank Portal</span>
            <span className="site-brand-note">Modern talent discovery, records management, and county visibility.</span>
          </span>
        </Link>

        <div className="site-header-nav">
          <div className="site-header-status">
            <span className="site-status-dot" aria-hidden="true" />
            <span className="site-status-copy">{statusText}</span>
          </div>

          <button
            className={`site-menu-toggle${isMenuOpen ? " is-open" : ""}`}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="portal-navigation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`site-nav-shell${isMenuOpen ? " is-open" : ""}`} id="portal-navigation">
            <div className="site-nav-shell-inner">
              <nav className="site-menu" aria-label="Portal menu">
                {navLinks.map((link) => (
                  <Link
                    key={`${link.to}-${link.label}`}
                    className={`menu-link${isLinkActive(link) ? " is-active" : ""}`}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="site-header-tools">
                <button type="button" className="site-track-link" onClick={handleAction}>
                  {isAuthenticated ? "Logout" : "Login"}
                </button>

                <button
                  className="theme-toggle theme-toggle-inline"
                  type="button"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
                >
                  <span className="theme-toggle-icon theme-toggle-icon-sun" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path
                        d="M12 4V2m0 20v-2m8-8h2M2 12h2m12.66 5.66 1.41 1.41M3.93 4.93l1.41 1.41m11.32-1.41 1.41-1.41M3.93 19.07l1.41-1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                  <span className="theme-toggle-icon theme-toggle-icon-moon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path
                        d="M20 15.79A8.5 8.5 0 0 1 8.21 4c-.13.47-.21.97-.21 1.5a8.5 8.5 0 0 0 10.5 8.29c.53 0 1.03-.08 1.5-.21Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                  <span className="theme-toggle-text sr-only">
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
