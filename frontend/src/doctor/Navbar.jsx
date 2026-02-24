import React, { useMemo, useState } from "react";
import { navbarStylesDr as ns } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { Calendar, Edit, Home, LogOut, Menu, X, Icon } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const location = useLocation();

  const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = location.pathname.match(/\/doctor-admin\/([^/]+)/);
    if (m) return m[1];
    return null;
  }, [params, location.pathname]);

  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : "/doctor-admin/login";

  const navItems = [
    { name: "Dashboard", to: `${basePath}`, Icon: Home },
    { name: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { name: "Edit Profile", to: `${basePath}/profile/edit`, Icon: Edit },
  ];

  return (
    <>
      <nav className={ns.navContainer}>
        <div className={ns.leftBrand}>
          <div className={ns.logoContainer}>
            <img src={logo} alt="logo" className={ns.logoImage} />
          </div>

          <div className={ns.brandTextContainer}>
            <div className={ns.brandTitle}>MedTek</div>
            <div className={ns.brandSubtitle}>Healthcare Solutions</div>
          </div>
        </div>

        {/* dektop navigation */}
        <div className={ns.desktopMenu}>
          <div className={ns.desktopMenuItems}>
            {navItems.map(({ name, to, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === basePath}
                className={({ isActive }) =>
                  `${ns.baseLink} ${isActive ? ns.activeLink : ns.inactiveLink}`
                }
                onClick={() => setOpen(false)}
              >
                <span className={ns.linkContent}>
                  <Icon size={16} className={ns.linkIcon} />
                  <span className={ns.linkText}>{name}</span>
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className={ns.rightActions}>
          <button
            onClick={() => {
              window.location.href = "/doctor-admin/login";
            }}
            className={ns.logoutButtonDesktop}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          {/* to toggle */}
          <button
            onClick={() => setOpen((s) => !s)}
            className={ns.hamburgerButtonMd}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            onClick={() => setOpen((s) => !s)}
            className={ns.hamburgerButtonLg}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={ns.mobileMenuContainer(open)}>
        <div className={ns.mobileMenuContent}>
          {navItems.map(({ name, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === basePath}
              className={({ isActive }) =>
                `${ns.mobileBaseLink} ${isActive ? ns.mobileActiveLink : ns.mobileInactiveLink}`
              }
              onClick={() => setOpen(false)}
            >
              <Icon size={18} className="text-emerald-400" />
              <span>{name}</span>
            </NavLink>
          ))}

          <button
            onClick={() => {
              setOpen(false);
              window.location.href = "/doctor-admin/login";
            }}
            className={ns.mobileLogoutButton}
          >
            <div className={ns.mobileLogoutContent}>
              <LogOut size={16} />
              Logout
            </div>
          </button>
        </div>
      </div>

      <div className={ns.spacer}></div>
    </>
  );
};

export default Navbar;
