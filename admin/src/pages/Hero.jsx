import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { heroStyles as hs } from "../assets/dummyStyles";
import logo from "../assets/logo.png";

const Hero = ({ role = "admin", userName = "Doctor" }) => {
  const isDoctor = role === "doctor";
  return (
    <div className={hs.container}>
      <Navbar />
      <main className={hs.mainContainer}>
        <section className={hs.section}>
          <div className={hs.decorativeBg.container}>
            <div className={hs.decorativeBg.blurBackground}>
              <div className={hs.decorativeBg.blurShape}></div>
            </div>

            <div className={hs.contentBox}>
              <div className={hs.logoContainer}>
                <img src={logo} alt="Logo" className={hs.logo} />
              </div>
              <h1 className={hs.heading}>
                {isDoctor
                  ? `Welcome, Dr. ${userName}`
                  : "Welcome to your Admin Dashboard"}
              </h1>

              <p className={hs.description}>
                {isDoctor
                  ? "Access your patient records, manage appointments, and review medical reports securely from your dashboard."
                  : "Manage hospital operations, doctors, staff, patient records, and system settings from a centralized control panel."}
              </p>

              {/* info card */}
              <div className={hs.infoCards.container}>
                <div className={hs.infoCards.card}>
                  <h3 className={hs.infoCards.cardTitle}>Secure Access</h3>

                  <p className={hs.infoCards.cardText}>
                    Role-based login protected medical data.
                  </p>
                </div>

                <div className={hs.infoCards.card}>
                  <h3 className={hs.infoCards.cardTitle}>
                    Real-time Management
                  </h3>

                  <p className={hs.infoCards.cardText}>
                    Monitor hospital activity and patient flow.
                  </p>
                </div>

                <div className={hs.infoCards.card}>
                  <h3 className={hs.infoCards.cardTitle}>Medical Dashboard</h3>

                  <p className={hs.infoCards.cardText}>
                    Clean,fast,and doctor-friendly interface.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;
