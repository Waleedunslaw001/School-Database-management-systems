import React, { useState } from 'react';

export default function StudentForm({ onSubmit }) {
  const [formData, setFormData] = useState({ fullName: '', email: '', gradeLevel: '9', attendanceTarget: 90, profilePhoto: null, notes: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setSuccessMessage('Student record saved successfully!');
      setFormData({ fullName: '', email: '', gradeLevel: '9', attendanceTarget: 90, profilePhoto: null, notes: '' });
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <form className="edupulse-form" onSubmit={handleSubmit}>
      <h3>Add New Student Record</h3>
      {successMessage && <div className="alert-success">{successMessage}</div>}
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Jane Doe" />
        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane.doe@school.edu" />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="gradeLevel">Grade Level</label>
        <select id="gradeLevel" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange}>
          <option value="9">Grade 9</option><option value="10">Grade 10</option><option value="11">Grade 11</option><option value="12">Grade 12</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="attendanceTarget">Attendance Target: {formData.attendanceTarget}%</label>
        <input type="range" id="attendanceTarget" name="attendanceTarget" min="50" max="100" value={formData.attendanceTarget} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="profilePhoto">Upload Profile Document/Photo</label>
        <input type="file" id="profilePhoto" name="profilePhoto" onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Formatted Notes / Remarks</label>
        <textarea id="notes" name="notes" rows="4" value={formData.notes} onChange={handleChange} placeholder="Enter accommodation details..." />
      </div>
      <button type="submit" className="submit-btn">Save Record</button>
    </form>
  );
}
