import React, { useState } from "react";
import { contactPageStyles as cp } from "../assets/dummyStyles";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  SendHorizonal,
  Stethoscope,
  User,
} from "lucide-react";

const ContactPage = () => {
  const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const departments = [
    "General Physician",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Gynecology",
  ];

  const servicesMapping = {
    "General Physician": [
      "General Consultation",
      "Adult Checkup",
      "Vaccination",
      "Health Screening",
    ],
    Cardiology: [
      "ECG",
      "Echocardiography",
      "Stress Test",
      "Heart Consultation",
    ],
    Orthopedics: ["Fracture Care", "Joint Pain Consultation", "Physiotherapy"],
    Dermatology: ["Skin Consultation", "Allergy Test", "Acne Treatment"],
    Pediatrics: ["Child Checkup", "Vaccination (Child)", "Growth Monitoring"],
    Gynecology: ["Antenatal Care", "Pap Smear", "Ultrasound"],
  };

  const genericServices = [
    "General Consultation",
    "ECG",
    "Blood Test",
    "X-Ray",
    "Ultrasound",
    "Physiotherapy",
    "Vaccination",
  ];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      e.phone = "Phone number must be exactly 10 digits";

    if (!form.department && !form.service) {
      e.department = "Please choose a department or service";
      e.service = "Please choose a department or service";
    }

    if (!form.message.trim()) e.message = "Please write a short message";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "department") {
      setForm((prev) => ({ ...prev, department: value, service: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "department" || name === "service") {
      setErrors((prev) => {
        const copy = { ...prev };
        if (
          (name === "department" && value) ||
          (name === "service" && value) ||
          form.department ||
          form.service
        ) {
          delete copy.department;
          delete copy.service;
        }
        return copy;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const text = `*Contact Request*\nName: ${form.name}\nEmail: ${
      form.email
    }\nPhone: ${form.phone}\nDepartment: ${
      form.department || "N/A"
    }\nService: ${form.service || "N/A"}\nMessage: ${form.message}`;

    const url = `https://wa.me/8299431275?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setForm(initial);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const availableServices = form.department
    ? servicesMapping[form.department] || []
    : genericServices;

  return (
    <div className={cp.pageContainer}>
      <div className={cp.bgAccent1}></div>
      <div className={cp.bgAccent2}></div>

      <div className={cp.gridContainer}>
        <div className={cp.formContainer}>
          <h2 className={cp.formTitle}>Contact our Clinic</h2>
          <p className={cp.formSubtitle}>
            Fill the form - we'll open whatApp so you can connect with us
            instantly.
          </p>

          <form onSubmit={handleSubmit} className={cp.formSpace}>
            <div className={cp.formGrid}>
              <div>
                <label className={cp.label}>
                  <User size={16} /> Full Name
                </label>
                <input
                  name="name"
                  className={cp.input}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
                {errors.name && <p className={cp.error}>{errors.name}</p>}
              </div>

              <div>
                <label className={cp.label}>
                  <Mail size={16} /> Email
                </label>
                <input
                  name="email"
                  type="email"
                  className={cp.input}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                />
                {errors.name && <p className={cp.error}>{errors.email}</p>}
              </div>
            </div>

            {/* Phone + Department */}
            <div className={cp.formGrid}>
              <div>
                <label className={cp.label}>
                  <Phone size={16} /> Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={cp.input}
                  maxLength="10"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className={cp.error}>{errors.phone}</p>}
              </div>

              <div>
                <label className={cp.label}>
                  <MapPin size={16} /> Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={cp.input}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className={cp.error}>{errors.department}</p>
                )}
              </div>
            </div>

            <div>
              <label className={cp.label}>
                <Stethoscope size={16} /> Service
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className={cp.input}
              >
                <option value="">
                  Select Service (or choose Department above)
                </option>

                {availableServices.map((s) => (
                  <option value={s} key={s}>
                    {s}
                  </option>
                ))}
              </select>

              {errors.service && <p className={cp.error}>{errors.service}</p>}
            </div>

            <div>
              <label className={cp.label}>
                <MessageSquare size={16} />
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your concern briefly..."
                rows={4}
                className={cp.textarea}
              />

              {errors.message && <p className={cp.error}>{errors.message}</p>}
            </div>

            <div className={cp.buttonContainer}>
              <button type="submit" className={cp.button}>
                <SendHorizonal size={18} /> <span>Send via WhatsApp</span>
              </button>

              {sent && (
                <p className={cp.sentMessage}>
                  Opening WhatsApp and clearing form...
                </p>
              )}
            </div>
          </form>
        </div>

        {/* right side */}
        <div className={cp.infoContainer}>
          <div className={cp.infoCard}>
            <h3 className={cp.infoTitle}>Visit our Clinic</h3>
            <p className={cp.infoText}>Gomti Nagar, Lucknow, Uttar Pradesh</p>
            <p className={cp.infoItem}>
              <Phone size={16} /> 8840277956
            </p>
            <p className={cp.infoItem}>
              <Mail size={16} /> example@gmail.com
            </p>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.481827278577!2d81.0981!3d26.951637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39995ee81add328f%3A0xbe8acc99218572c9!2sShri%20Ramswaroop%20Memorial%20University!5e0!3m2!1sen!2sin!4v1771855703943!5m2!1sen!2sin"
            className={cp.map}
            title="Gomti Nagar Map"
            loading="lazy"
            allowFullScreen
          ></iframe>

          <div className={cp.hoursContainer}>
            <h4 className={cp.hoursTitle}>Clinic Hours</h4>
            <p className={cp.hoursText}>Mon - Sat: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      <style>{cp.animationKeyframes}</style>
    </div>
  );
};

export default ContactPage;
