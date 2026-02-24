import React from "react";
import { footerStyles as f } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import {
  Activity,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Stethoscope,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/doctors" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
    { name: "Appointments", href: "/appointments" },
  ];

  const services = [
    { name: "Blood Pressure Check", href: "/services" },
    { name: "Blood Sugar Test", href: "/services" },
    { name: "Full Blood Count", href: "/services" },
    { name: "X-Ray Scan", href: "/services" },
  ];

  const socialLinks = [
    {
      Icon: Facebook,
      color: f.facebookColor,
      name: "Facebook",
      href: "/",
    },
    {
      Icon: Twitter,
      color: f.twitterColor,
      name: "Twitter",
      href: "/",
    },
    {
      Icon: Instagram,
      color: f.instagramColor,
      name: "Instagram",
      href: "/",
    },
    {
      Icon: Linkedin,
      color: f.linkedinColor,
      name: "LinkedIn",
      href: "/",
    },
    {
      Icon: Youtube,
      color: f.youtubeColor,
      name: "YouTube",
      href: "/",
    },
  ];
  return (
    <footer className={f.footerContainer}>
      <div className={f.floatingIcon1}>
        <Stethoscope className={f.stethoscopeIcon} />
      </div>
      <div className={f.floatingIcon2} style={{ animationDelay: "3s" }}>
        <Activity className={f.activityIcon} />
      </div>

      <div className={f.mainContent}>
        <div className={f.gridContainer}>
          <div className={f.companySection}>
            <div className={f.logoContainer}>
              <div className={f.logoWrapper}>
                <div className={f.logoImageContainer}>
                  <img src={logo} alt="logo" className={f.logoImage} />
                </div>
              </div>

              <div>
                <h2 className={f.companyName}>MediCare</h2>
                <p className={f.companyTagline}>Healthcare Solutions</p>
              </div>
            </div>

            <p className={f.companyDescription}>
              Your trusted partner in healthcare innovation.
            </p>

            <div className={f.contactContainer}>
              <div className={f.contactItem}>
                <div className={f.contactIconWrapper}>
                  <Phone className={f.contactIcon} />
                </div>
                <span className={f.contactText}>0123456789</span>
              </div>

              <div className={f.contactItem}>
                <div className={f.contactIconWrapper}>
                  <Mail className={f.contactIcon} />
                </div>
                <span className={f.contactText}>example@ex.com</span>
              </div>

              <div className={f.contactItem}>
                <div className={f.contactIconWrapper}>
                  <MapPin className={f.contactIcon} />
                </div>
                <span className={f.contactText}>Lucknow, India</span>
              </div>
            </div>
          </div>

          {/* quick links */}
          <div className={f.linksSection}>
            <h3 className={f.sectionTitle}>Quick Links</h3>
            <ul className={f.linksList}>
              {quickLinks.map((link, index) => (
                <li className={f.linkItem} key={link.name}>
                  <Link
                    to={link.href}
                    className={f.quickLink}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className={f.quickLinkIconWrapper}>
                      <ArrowRight className={f.quickLinkIcon} />
                    </div>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={f.linksSection}>
            <h3 className={f.sectionTitle}>Our Services</h3>
            <ul className={f.linksList}>
              {services.map((service,index) => (
               <li key={`${service.name}-${index}`}>
                  <Link to={service.href} className={f.serviceLink}>
                    <div className={f.serviceIcon}></div>
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className={f.newsletterSection}>
            <h3 className={f.newsletterTitle}>Stay Connected</h3>
            <p className={f.newsletterDescription}>
              Subscribe for health tips, medical updates, and wellness insights
              delivered to your inbox.
            </p>

            {/* Newsletter form */}
            <div className={f.newsletterForm}>
              <div className={f.mobileNewsletterContainer}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={f.emailInput}
                />
                <button className={f.mobileSubscribeButton}>
                  <Send className={f.mobileButtonIcon} />
                  Subscribe
                </button>
              </div>

              {/* Desktop newsletter */}
              <div className={f.desktopNewsletterContainer}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={f.desktopEmailInput}
                />
                <button className={f.desktopSubscribeButton}>
                  <Send className={f.desktopButtonIcon} />
                  <span className={f.desktopButtonText}>Subscribe</span>
                </button>
              </div>

              {/* Social icons */}
              <div className={f.socialContainer}>
                {socialLinks.map(({ Icon, color, name, href }, index) => (
                  <Link
                    key={name}
                    to={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={f.socialLink}
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className={f.socialIconBackground} />
                    <Icon className={`${f.socialIcon} ${color}`} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={f.bottomSection}>
          <div className={f.copyright}>
            <span>&copy; {currentYear} MediCare Healthcare</span>
          </div>
        </div>
      </div>

      <style>{f.animationStyles}</style>
    </footer>
  );
};

export default Footer;
