import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "../App.css";

const FormField = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    street1: "",
    street2: "",
    sameAsResidential: false,
    permanentStreet1: "",
    permanentStreet2: "",
    additionalFiles: [{ name: "", type: "" }],
  });

  const [errors, setErrors] = useState({});
  const [formRecords, setFormRecords] = useState([]);

  const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const isValidDate = (dateString) => {
    const birthDate = new Date(dateString);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 18;
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.birthDate) {
      newErrors.birthDate = "Date of birth is required";
    } else if (!isValidDate(formData.birthDate)) {
      newErrors.birthDate = "You must be at least 18 years old";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAdditionalFileChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAdditionalFiles = [...formData.additionalFiles];
    updatedAdditionalFiles[index] = {
      ...updatedAdditionalFiles[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      additionalFiles: updatedAdditionalFiles,
    });
  };

  const handleCancelFile = (index) => {
    const updatedAdditionalFiles = [...formData.additionalFiles];
    updatedAdditionalFiles[index] = { name: "", type: "" };
    setFormData({
      ...formData,
      additionalFiles: updatedAdditionalFiles,
    });
  };

  const handleAddMoreFiles = () => {
    setFormData({
      ...formData,
      additionalFiles: [...formData.additionalFiles, { name: "", type: "" }],
    });
  };

  const handleDeleteFile = (index) => {
    const updatedAdditionalFiles = [...formData.additionalFiles];
    updatedAdditionalFiles.splice(index, 1);
    setFormData({
      ...formData,
      additionalFiles: updatedAdditionalFiles,
    });
  };

  const firebaseConfig = {
    apiKey: "AIzaSyAeI4-hGPZ3f6MdfWfHFz6rgDzPbimTNBM",
    authDomain: "react-test-machine.firebaseapp.com",
    databaseURL: "https://react-test-machine-default-rtdb.firebaseio.com",
    projectId: "react-test-machine",
    storageBucket: "react-test-machine.appspot.com",
    messagingSenderId: "47853279420",
    appId: "1:47853279420:web:4b10c8219bc9a3dbd598b9",
    measurementId: "G-MPNTWBJTB5"
  };
  
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      database.ref('formData').push(formData)
        .then(() => {
          console.log("Form data submitted to Firebase:", formData);
        })
        .catch((error) => {
          console.error("Error submitting form data to Firebase:", error);
        });
    } else {
      console.log("Form Validation Failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;

    if (name === "sameAsResidential") {
      setFormData({
        ...formData,
        [name]: e.target.checked,
        permanentStreet1: e.target.checked ? formData.street1 : "",
        permanentStreet2: e.target.checked ? formData.street2 : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const formRef = firebase.database().ref('formData');
      formRef.on('value', (snapshot) => {
        const formData = snapshot.val();
        const formDataList = [];
        for (let id in formData) {
          formDataList.push({ id, ...formData[id] });
        }
        setFormRecords(formDataList);
      });
    };

    fetchData();

    return () => firebase.database().ref('formData').off('value');
  }, []);

  return (
    <div>
      <h1>REACT JS MACHINE TEST</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-section row names">
          <div>
            <label>First Name:<span className="mandatory">*</span> </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="Enter your first name"
              onChange={handleChange}
              required // Adding required attribute
            />
            {errors.firstName && <div className="error">{errors.firstName}</div>}
          </div>
          <div>
            <label>Last Name: <span className="mandatory">*</span>  </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Enter your last name"
              onChange={handleChange}
              required // Adding required attribute
            />
            {errors.lastName && <div className="error">{errors.lastName}</div>}
          </div>
        </div>
        <div className="form-section row">
          <div>
            <label>Email: <span className="mandatory">*</span>  </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required // Adding required attribute
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div>
            <label>Date of Birth: <span className="mandatory">*</span>  </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required // Adding required attribute
            />
            {errors.birthDate && <div className="error">{errors.birthDate}</div>}
          </div>
        </div>
        <label>Residential Address: <span className="mandatory">*</span>  </label>
        <div className="form-section row">
          <div>
            <label>Street 1:<span className="mandatory">*</span> </label>
            <input
              type="text"
              name="street1"
              value={formData.street1}
              placeholder="Enter street 1"
              onChange={handleChange}
              required // Adding required attribute
            />
          </div>
          <div>
            <label>Street 2:<span className="mandatory">*</span> </label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              placeholder="Enter street 2"
              onChange={handleChange}
              required // Adding required attribute
            />
          </div>
        </div>
        <div className="form-section row">
          <input
            type="checkbox"
            name="sameAsResidential"
            onChange={handleCheckboxChange}
            checked={formData.sameAsResidential}
          />
          <label style={{ margin: "0" }}>Same as Residential</label>
          {errors.sameAsResidential && (
            <div className="error">{errors.sameAsResidential}</div>
          )}
        </div>
        <label>Permanent Address:</label>
        <div className="form-section row">
          <div>
            <label>Street 1:</label>
            <input
              type="text"
              name="permanentStreet1"
              value={
                formData.sameAsResidential
                  ? formData.street1
                  : formData.permanentStreet1
              }
              placeholder="Enter street 1"
              onChange={handleChange}
              disabled={formData.sameAsResidential}
            />
          </div>
          <div>
            <label>Street 2: </label>
            <input
              type="text"
              name="permanentStreet2"
              value={
                formData.sameAsResidential
                  ? formData.street2
                  : formData.permanentStreet2
              }
              placeholder="Enter street 2"
              onChange={handleChange}
              disabled={formData.sameAsResidential}
            />
          </div>
        </div>
        <div className="form-section row">
          <div className="upload-section">
            <label>Upload Documents: </label>
            <div className="file-inputs">
              {formData.additionalFiles.map((file, index) => (
                <div key={index} className="form-section row">
                  <div>
                    <label>File Name:<span className="mandatory">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={file.name}
                      placeholder="Enter file name"
                      onChange={(e) => handleAdditionalFileChange(e, index)}
                      required // Adding required attribute
                    />
                  </div>
                  <div>
                    <label>Type of File:<span className="mandatory">*</span> </label>
                    <select
                      name="type"
                      value={file.type}
                      onChange={(e) => handleAdditionalFileChange(e, index)}
                      className="custom-select"
                      required // Adding required attribute
                    >
                      <option value="">Select type</option>
                      <option value="PDF">PDF</option>
                      <option value="JPG">JPG</option>
                      <option value="JPEG">JPEG</option>
                    </select>
                  </div>

                  <div>
                    <input type="file" name={`fileUpload${index}`} accept={file.type === "JPG" ? ".jpg" : (file.type === "JPEG" ? ".jpeg" : ".pdf")} onChange={(e) => handleAdditionalFileChange(e, index)} />
                    {formData.additionalFiles[index].name && (
                      <button type="button" onClick={() => handleCancelFile(index)}>Cancel</button>
                    )}
                  </div>

                  {index > 0 && (
                    <div>
                      <button type="button" onClick={() => handleDeleteFile(index)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
              <div>
                <button type="button" onClick={handleAddMoreFiles}>+</button>
              </div>
            </div>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Form Records</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Date Of Birth</th>
                <th>Residential Addredd</th>
                <th>Permanent Addredd</th>
                <th>File Name</th>
                <th>File Type</th>
                <th>upload file</th>
              </tr>
            </thead>
            <tbody>
              {formRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.firstName}</td>
                  <td>{record.lastName}</td>
                  <td>{record.email}</td>
                  <td>{record.birthDate}</td>
                  <td>{record.street1 + " - " + record.street2}</td>
                  <td>{record.permanentStreet1 + " - " + record.permanentStreet2}</td>
                  <td>{record.additionalFiles[0].name}</td>
                  <td>{record.additionalFiles[0].type}</td>
                  <td>{record.additionalFiles[0].fileUpload0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormField;
