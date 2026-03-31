import React, { useState } from "react";
import { loginPageStyles as lp, toastStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEY = "doctorToken_v1";

const LoginPage = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((s) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("All fields are required.", {
        style: toastStyles.errorToast,
      });
      return;
    }

    setBusy(true);
    try {
      const baseUrl = API_BASE || "";
      const res = await fetch(`${baseUrl}/api/doctors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(json?.message || "Login failed", { duration: 4000 });
        setBusy(false);
        return;
      }
      const token = json?.token || json?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      const doctorId =
        json?.data?._id || json?.doctor?._id || json?.data?.doctor?._id;
      if (!doctorId) {
        toast.error("Doctor ID missing from server response");
        setBusy(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, token);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: token }),
      );
      toast.success("Login successful — redirecting...", {
        style: toastStyles.successToast,
      });
      setTimeout(() => {
        navigate(`/doctor-admin/${doctorId}`);
      }, 700);
    } catch (err) {
      console.error("login error", err);
      toast.error("Network error during login");
      setBusy(false);
    }
  };

  return (
    <div className={lp.mainContainer}>
      <Toaster position="top-right" reverseOrder={false} />
      <button onClick={() => navigate("/")} className={lp.backButton}>
        <ArrowLeft className={lp.backButtonIcon} />
        Back to Home
      </button>

      <div className={lp.loginCard}>
        <div className={lp.logoContainer}>
          <img src={logo} alt="logo" className={lp.logo} />
        </div>

        <h2 className={lp.title}>Doctor Admin</h2>
        <p className={lp.subtitle}>Sign in to manage your profile & schedule</p>

        <form onSubmit={handleLogin} className={lp.form}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={lp.input}
            required
          />

           <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={lp.input}
            required
          />

          <button type="submit" disabled={busy} className={lp.submitButton}>
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
