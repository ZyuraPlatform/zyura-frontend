import { useState } from "react";
import logo from "../../assets/home/zyure.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout, selectUser } from "@/store/features/auth/auth.slice";
import Cookies from "js-cookie";

const navLinks = [
  { to: "hero", label: "Home" },
  { to: "tools", label: "Tools" },
  { to: "study-plan", label: "Study Plan" },
  { to: "ai-tools", label: "AI Tools" },
  { to: "about-us", label: "About US" },
  { to: "mentors", label: "Mentors" },
  { to: "pricing", label: "Pricing" },
  { to: "contact-us", label: "Contact US" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser); // get logged in user
  const location = useLocation();
  const handleLogout = () => {
    dispatch(logout()); // clear Redux state
    Cookies.remove("accessToken"); // remove token
    navigate("/login"); // redirect
  };

  const handleRedirectToDashboard = () => {
    if (user?.account?.role === "ADMIN") {
      navigate("/admin");
      return;
    } else if (user?.account?.role === "MENTOR") {
      navigate("/mentor");
      return;
    } else if (
      user?.account?.role === "STUDENT" ||
      user?.account?.role === "PROFESSIONAL"
    ) {
      navigate("/dashboard");
      return;
    }
  };

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (!element) return;

    const offset = -70;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  };

  const handleScroll = (section: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scrollToSection(section);
      }, 500);
    } else {
      scrollToSection(section);
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 " data-aos="fade-down">
      <div className="bg-white/10 backdrop-blur-md ">
        <div className="max-w-[1920px] mx-auto">
          <div className="hidden items-center justify-between px-7 py-4 lg:flex h-28">
            <nav className="flex items-center gap-2">
              {navLinks.slice(0, 5).map((link) => (
                <button
                  type="button"
                  key={link.to}
                  onClick={() => handleScroll(link.to)}
                  className="font-sora text-[16px] font-light text-white/90 transition hover:bg-primary p-3 rounded-lg"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div>
              <Link
                to="/"
                className="font-pattaya text-4xl leading-none text-white"
              >
                <img
                  src={logo}
                  alt="Zyura Logo"
                  className="h-18 object-contain w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-2">
                {navLinks.slice(5).map((link) => (
                  <button
                    type="button"
                    key={link.to}
                    onClick={() => handleScroll(link.to)}
                    className="font-sora text-[16px] font-light text-white/90 transition hover:bg-primary p-3 rounded-lg"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              {user ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRedirectToDashboard}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white px-5 font-light py-3 font-sora text-sm text-white transition hover:bg-white/10"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-sora font-light text-sm text-white transition bg-brand-gradient hover:bg-brand-gradient-hover"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 rounded-lg border border-white px-5 font-light py-3 font-sora text-sm text-white transition hover:bg-white/10"
                  >
                    Registration
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-sora font-light text-sm text-white transition bg-brand-gradient hover:bg-brand-gradient-hover"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-4 lg:hidden">
            <div>
              <Link
                to="/"
                className="font-pattaya text-4xl leading-none text-white"
              >
                <img src={logo} alt="Zyura Logo" className="h-10 w-auto" />
              </Link>
            </div>
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-[1360px] px-5 md:px-8 lg:hidden">
          <div
            id="mobile-menu"
            className="rounded-2xl border border-white/20 bg-[#063C79]/95 px-4 pb-6 pt-3 shadow-xl backdrop-blur-md"
          >
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  type="button"
                  onClick={() => {
                    handleScroll(link.to);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-md px-3 py-2.5 font-sora text-base font-medium text-white hover:bg-white/10"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-3 px-1">
              <Link
                to="/signup"
                className="w-full rounded-lg border border-white px-5 py-3 text-center font-sora text-base font-semibold text-white hover:bg-white/10"
              >
                Registration
              </Link>
              <Link
                to="/login"
                className="w-full rounded-lg bg-white px-5 py-3 text-center font-sora text-base font-semibold text-brand"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
