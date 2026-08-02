import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function EmployerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    companyDescription: "",
    website: "",
    location: "",
    profilePicture: "",
  });

  // ===============================
  // GET EMPLOYER PROFILE
  // ===============================
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");

      const user = res.data.user || res.data;

      setForm({
        name: user.name || "",
        email: user.email || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        website: user.website || "",
        location: user.location || "",
        profilePicture: user.profilePicture || "",
      });

      if (user.profilePicture) {
        setPreview(
          user.profilePicture.startsWith("http")
            ? user.profilePicture
            : `http://localhost:5000${user.profilePicture}`
        );
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);



  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };



  
  // ===============================
// UPLOAD PROFILE PICTURE
// ===============================
const handleImageUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Show selected image immediately
  setPreview(URL.createObjectURL(file));

  const data = new FormData();
  data.append("profilePicture", file);

  try {
    setUploading(true);

    const res = await api.post(
      "/auth/me/profile-picture",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Profile picture uploaded");

    const picture = res.data.profilePicture;

    // Save URL in form state
    setForm((prev) => ({
      ...prev,
      profilePicture: picture,
    }));

    // Display uploaded image
    setPreview(
      picture.startsWith("http")
        ? picture
        : `http://localhost:5000${picture}`
    );

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message || "Image upload failed"
    );
  } finally {
    setUploading(false);
  }
};
  // ===============================
  // UPDATE PROFILE
  // ===============================
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const res = await api.put(
      "/auth/me",
      form
    );

    toast.success("Profile updated successfully");

    console.log(res.data);

  } catch (error) {

    console.log(error.response?.data || error.message);

    toast.error(
      error.response?.data?.message || 
      "Profile update failed"
    );

  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading profile...
      </div>
    );
  }



  return (

    <div className="min-h-screen bg-slate-100 py-10">


      <div className="max-w-3xl mx-auto bg-white shadow-lg p-8">


        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          Employer Profile
        </h1>



        {/* PROFILE IMAGE */}

        <div className="flex flex-col items-center mb-8">


          <img
            src={
              preview ||
              "https://via.placeholder.com/150"
            }
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
          />


          <label className="mt-4 cursor-pointer bg-blue-600 text-white px-5 py-2 rounded">

            {
              uploading
              ? "Uploading..."
              : "Change Picture"
            }


            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />

          </label>


        </div>




        <form onSubmit={handleSubmit} className="space-y-5">


          <div>
            <label className="block font-semibold">
              Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-3"
            />

          </div>



          <div>
            <label className="block font-semibold">
              Email
            </label>

            <input
              disabled
              value={form.email}
              className="w-full border p-3 bg-gray-100"
            />

          </div>




          <div>
            <label className="block font-semibold">
              Company Name
            </label>

            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="w-full border p-3"
            />

          </div>




          <div>
            <label className="block font-semibold">
              Company Description
            </label>

            <textarea
              name="companyDescription"
              value={form.companyDescription}
              onChange={handleChange}
              rows="4"
              className="w-full border p-3"
            />

          </div>




          <div>
            <label className="block font-semibold">
              Website
            </label>

            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className="w-full border p-3"
            />

          </div>




          <div>
            <label className="block font-semibold">
              Location
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-3"
            />

          </div>




          <button
            disabled={saving}
            className="w-full bg-blue-700 text-white py-3 font-semibold hover:bg-blue-800"
          >

            {
              saving
              ? "Saving..."
              : "Save Profile"
            }

          </button>


        </form>


      </div>


    </div>

  );
}