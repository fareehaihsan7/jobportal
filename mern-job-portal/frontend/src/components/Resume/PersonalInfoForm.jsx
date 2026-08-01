// export default function PersonalInfoForm({ resume, setResume }) {
//   const { personalInfo } = resume;

//   const handleChange = (e) => {
//     setResume({
//       ...resume,
//       personalInfo: {
//         ...personalInfo,
//         [e.target.name]: e.target.value,
//       },
//     });
//   };
export default function PersonalInfoForm({ resume, setResume }) {

  const personalInfo = resume.personalInfo || {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  };


  const handleChange = (e) => {
    setResume({
      ...resume,

      personalInfo: {
        ...personalInfo,
        [e.target.name]: e.target.value,
      },

    });
  };
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={personalInfo.fullName}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={personalInfo.email}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={personalInfo.phone}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={personalInfo.location}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn"
          value={personalInfo.linkedin}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          name="github"
          placeholder="GitHub"
          value={personalInfo.github}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

      </div>

      <input
        type="text"
        name="portfolio"
        placeholder="Portfolio Website"
        value={personalInfo.portfolio}
        onChange={handleChange}
        className="border rounded-lg p-3 w-full mt-4"
      />
    </div>
  );
}