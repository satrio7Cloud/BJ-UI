import { useState } from "react";

export default function VehicleServiceForm() {
  const [form, setForm] = useState({
    duration: "",
    ownership: "",
    plateNumber: "",
    vehicleYear: "",
    vehicleType: "",
    brand: "",
    model: "",
    color: "",
    chassisNumber: "",
    engineNumber: "",
    ownerName: "",
    address: "",
    stnkExpiry: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        Vehicle Administration Service
      </h2>

      {/* Durasi */}
      <div>
        <label className="block font-medium mb-2">Extension Duration</label>
        <select
          name="duration"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select duration</option>
          <option value="1_year">1 Year</option>
          <option value="5_years">5 Years</option>
        </select>
      </div>

      {/* Kepemilikan */}
      <div>
        <label className="block font-medium mb-2">Vehicle Ownership</label>
        <select
          name="ownership"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select ownership</option>
          <option value="personal">Personal</option>
          <option value="company">Company</option>
        </select>
      </div>

      {/* Plat Nomor */}
      <div>
        <label className="block font-medium mb-2">Plate Number</label>
        <input
          type="text"
          name="plateNumber"
          placeholder="B 1234 XYZ"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Tahun */}
      <div>
        <label className="block font-medium mb-2">Vehicle Year</label>
        <input
          type="number"
          name="vehicleYear"
          placeholder="2022"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Jenis Kendaraan */}
      <div>
        <label className="block font-medium mb-2">Vehicle Type</label>
        <select
          name="vehicleType"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select type</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="car">Car</option>
        </select>
      </div>

      {/* Merek & Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            placeholder="Toyota / Honda"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Model / Type</label>
          <input
            type="text"
            name="model"
            placeholder="Avanza / Beat"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      {/* Warna */}
      <div>
        <label className="block font-medium mb-2">Color</label>
        <input
          type="text"
          name="color"
          placeholder="Black"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Nomor Rangka & Mesin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">Chassis Number</label>
          <input
            type="text"
            name="chassisNumber"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Engine Number</label>
          <input
            type="text"
            name="engineNumber"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      {/* Nama & Alamat */}
      <div>
        <label className="block font-medium mb-2">Owner Name (STNK)</label>
        <input
          type="text"
          name="ownerName"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Address (STNK)</label>
        <input
          type="text"
          name="address"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Masa Berlaku */}
      <div>
        <label className="block font-medium mb-2">STNK Expiry Date</label>
        <input
          type="date"
          name="stnkExpiry"
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Submit Request
      </button>
    </form>
  );
}
