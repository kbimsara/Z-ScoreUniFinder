"use client";

import { useRef, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../components/nav/NavBar";
import DropDown from "../components/dropdown/DropDown";
import SearchableDropDown from "../components/dropdown/SearchableDropDown";
import Table from "../components/table/Table";
import Footer from "../components/footer/Footer";
import "./globals.css";

// Validation Schema
const validationSchema = Yup.object({
  olResults: Yup.object({
    mathematics: Yup.string().required("Mathematics grade is required"),
    english: Yup.string().required("English grade is required"),
    science: Yup.string().required("Science grade is required"),
    sinhala: Yup.string(),
    tamil: Yup.string(),
  }),
  selectedSubjects: Yup.array()
    .min(1, "At least one A/L subject is required")
    .of(
      Yup.object({
        name: Yup.string().required("Subject name is required"),
        grade: Yup.string().required("Grade is required"),
      })
    ),
  personalInfo: Yup.object({
    district: Yup.string().required("District is required"),
    rank: Yup.number().positive("Rank must be positive"),
    zScore: Yup.number()
      .required("Z-Score is required")
      .min(-4, "Z-Score must be at least -4")
      .max(4, "Z-Score must be at most 4"),
    stream: Yup.string().required("Stream is required"),
    examYear: Yup.number()
      .required("Exam year is required")
      .min(2000, "Invalid exam year")
      .max(new Date().getFullYear(), "Exam year cannot be in the future"),
  }),
  additionalSubjects: Yup.object({
    commonGeneralTest: Yup.number()
      .typeError("Common General Test must be a number")
      .min(0, "Score cannot be negative")
      .max(100, "Score cannot exceed 100"),
  }),
});

export default function Home() {
  const streamTableRef = useRef();
  const crossStreamTableRef = useRef();
  const streams = [
    "Arts",
    "Commerce",
    "Biological Science",
    "Physical Science",
    "Engineering Technology",
    "Biosystems Technology",
  ];
  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Matale",
    "Kandy",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Mullaitivu",
    "Vavuniya",
    "Trincomalee",
    "Batticaloa",
    "Ampara",
    "Puttalam",
    "Kurunegala",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Monaragala",
    "Kegalle",
    "Ratnapura",
  ];
  const alSubjects = [
    "Biology",
    "Combined Mathematics",
    "Physics",
    "Chemistry",
    "Agriculture",
    "Business Studies",
    "Accounting",
    "Economics",
    "Business Statistics",
    "Information & Communication Technology (ICT)",
    "Engineering Technology",
    "Bio-system Technology",
    "Science for Technology",
    "Christianity",
    "Buddhism",
    "Hinduism",
    "Islam",
    "Buddhist Civilization",
    "Hindu Civilization",
    "Islam Civilization",
    "Christian Civilization",
    "Greek and Roman Civilization",
    "Sinhala",
    "Tamil",
    "English",
    "Pali",
    "Sanskrit",
    "Arabic",
    "Hindi",
    "Japanese",
    "Chinese",
    "Korean",
    "Malay",
    "French",
    "German",
    "Russian",
    "Political Science",
    "History",
    "Geography",
    "Logic and Scientific Method",
    "Mass Media and Communication Studies",
    "Art",
    "Drama and Theatre",
    "Dancing",
    "Music",
    "Home Science",
    "General English",
    "General Information Technology",
  ];
  const [currentSearchSubject, setCurrentSearchSubject] = useState("");
  const [streamResults, setStreamResults] = useState([]);
  const [crossStreamResults, setCrossStreamResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  // Initial form values
  const initialValues = {
    olResults: {
      mathematics: "",
      english: "",
      science: "",
      sinhala: "",
      tamil: "",
    },
    selectedSubjects: [],
    additionalSubjects: {
      commonGeneralTest: "",
      git: "",
      generalEnglish: "",
    },
    personalInfo: {
      district: "",
      rank: "",
      zScore: "",
      stream: "",
      examYear: new Date().getFullYear(),
    },
  };

  // Check if Common General Test score is too low
  const isLowScore = (values) => {
    const score = parseFloat(values?.additionalSubjects?.commonGeneralTest);
    return isNaN(score) || score <= 30;
  };

  const handleAddSubject = (subject, values, setFieldValue) => {
    if (subject && !values.selectedSubjects.find((s) => s.name === subject)) {
      const newSubjects = [
        ...values.selectedSubjects,
        { name: subject, grade: "" },
      ];
      setFieldValue("selectedSubjects", newSubjects);
      setCurrentSearchSubject("");
    }
  };

  const handleRemoveSubject = (index, values, setFieldValue) => {
    const newSubjects = values.selectedSubjects.filter((_, i) => i !== index);
    setFieldValue("selectedSubjects", newSubjects);
  };

  const findUniversities = async (values) => {
    setIsProcessing(true);
    try {
      // Fetch stream-specific recommendations
      const streamResponse = await axios.post(
        "http://localhost:8000/api/v1/recommend",
        {
          district: values.personalInfo.district,
          stream: values.personalInfo.stream,
          zscore: parseFloat(values.personalInfo.zScore),
        }
      );
      setStreamResults(streamResponse.data.recommendations);
      setShowResults(true);
      toast.success(
        `Found ${streamResponse.data.recommendations.length} stream-specific recommendations!`
      );

      // Scroll to stream results
      setTimeout(() => {
        document
          .getElementById("stream-universities")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Fetch Cross Stream recommendations if showExtra is checked
      let crossStreamResponse = { data: { recommendations: [] } };
      if (showExtra) {
        crossStreamResponse = await axios.post(
          "http://localhost:8000/api/v1/recommend_cross_stream",
          {
            district: values.personalInfo.district,
            stream: values.personalInfo.stream,
            zscore: parseFloat(values.personalInfo.zScore),
          }
        );
        setCrossStreamResults(crossStreamResponse.data.recommendations);
        toast.success(
          `Found ${crossStreamResponse.data.recommendations.length} Cross Stream recommendations!`
        );
      } else {
        setCrossStreamResults([]);
      }

      // Scroll to Cross Stream results if stream results are empty and showExtra is checked
      if (streamResponse.data.recommendations.length === 0 && showExtra) {
        setTimeout(() => {
          document
            .getElementById("cross-stream-universities")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to get recommendations"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>University List</title>");
    printWindow.document.write(
      "<style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 8px; } h2 { margin-top: 20px; } .section { margin-bottom: 30px; }</style>"
    );
    printWindow.document.write("</head><body>");

    // Print stream-specific results if available
    if (streamTableRef.current && streamResults.length > 0) {
      printWindow.document.write('<div class="section"><h2>Stream-Specific Recommendations</h2>');
      printWindow.document.write(streamTableRef.current.innerHTML);
      printWindow.document.write('</div>');
    }

    // Print Cross Stream results if available and showExtra is checked
    if (showExtra && crossStreamTableRef.current && crossStreamResults.length > 0) {
      printWindow.document.write('<div class="section"><h2>Cross Stream Recommendations</h2>');
      printWindow.document.write(crossStreamTableRef.current.innerHTML);
      printWindow.document.write('</div>');
    }

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <Toaster />
      <NavBar />
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div id="home" className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to <span className="text-blue-400">Z-Score</span>{" "}
              University Finder
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Find your perfect university match using AI-powered Z-score
              analysis. Get personalized recommendations based on your academic
              performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                <div className="text-gray-400">Universities</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  48
                </div>
                <div className="text-gray-400">A/L Subjects</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">AI</div>
                <div className="text-gray-400">Powered Matching</div>
              </div>
            </div>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={findUniversities}
        >
          {({ values, setFieldValue, errors, touched, isValid }) => (
            <Form>
              {/* O/L Results Section */}
              <div id="ol-results" className="max-w-6xl mx-auto px-6 mb-12">
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        O/L Results
                      </h2>
                      <p className="text-gray-400">
                        Select your Ordinary Level examination results
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-5 grid-cols-1 gap-6">
                    {[
                      "mathematics",
                      "english",
                      "science",
                      "sinhala",
                      "tamil",
                    ].map((subject) => (
                      <div key={subject}>
                        <DropDown
                          label={`${
                            subject.charAt(0).toUpperCase() + subject.slice(1)
                          } ${
                            subject === "mathematics" ||
                            subject === "english" ||
                            subject === "science"
                              ? "*"
                              : ""
                          }`}
                          options={["A", "B", "C", "S", "F"]}
                          onSelect={(value) =>
                            setFieldValue(`olResults.${subject}`, value)
                          }
                        />
                        <ErrorMessage
                          name={`olResults.${subject}`}
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* A/L Results Section */}
              <div id="al-results" className="max-w-6xl mx-auto px-6 mb-12">
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        A/L Results *
                      </h2>
                      <p className="text-gray-400">
                        Add your Advanced Level subjects and grades
                      </p>
                    </div>
                  </div>

                  {/* Add Subject Section */}
                  <div className="mb-8">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <SearchableDropDown
                          label="Search Subject"
                          value={currentSearchSubject}
                          placeholder="Search for a subject..."
                          options={alSubjects}
                          onSelect={(subject) =>
                            setCurrentSearchSubject(subject)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddSubject(
                            currentSearchSubject,
                            values,
                            setFieldValue
                          )
                        }
                        disabled={!currentSearchSubject}
                        className="bg-blue-800 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Subject
                      </button>
                    </div>
                  </div>

                  {/* Selected Subjects */}
                  <FieldArray name="selectedSubjects">
                    {() => (
                      <div>
                        {values.selectedSubjects.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4">
                              Selected Subjects
                            </h3>
                            <div className="space-y-3">
                              {values.selectedSubjects.map((subject, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-800 rounded-lg p-4 border border-gray-600 hover:bg-gray-600 transition-colors"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                      <span className="text-white font-medium">
                                        {subject.name}
                                      </span>
                                    </div>
                                    <div className="w-px h-20 bg-gray-700"></div>
                                    <div className="px-5">
                                      <DropDown
                                        label="Grade *"
                                        options={["A", "B", "C", "S", "F"]}
                                        onSelect={(grade) =>
                                          setFieldValue(
                                            `selectedSubjects.${index}.grade`,
                                            grade
                                          )
                                        }
                                      />
                                      <ErrorMessage
                                        name={`selectedSubjects.${index}.grade`}
                                        component="div"
                                        className="text-red-400 text-sm mt-1"
                                      />
                                    </div>
                                    <div className="w-px h-20 bg-gray-700"></div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveSubject(
                                          index,
                                          values,
                                          setFieldValue
                                        )
                                      }
                                      className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <ErrorMessage
                              name="selectedSubjects"
                              component="div"
                              className="text-red-400 text-sm mt-2"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>

                  {/* Additional Subjects */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Additional Subjects
                    </h3>
                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Common General Test
                        </label>
                        <Field
                          type="text"
                          name="additionalSubjects.commonGeneralTest"
                          placeholder="Enter your result (e.g., 75)"
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <ErrorMessage
                          name="additionalSubjects.commonGeneralTest"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      {["generalEnglish", "git"].map((subject) => (
                        <div key={subject}>
                          <DropDown
                            label={
                              subject === "generalEnglish"
                                ? "General English"
                                : "GIT (General Information Technology)"
                            }
                            options={["A", "B", "C", "S", "F"]}
                            onSelect={(value) =>
                              setFieldValue(
                                `additionalSubjects.${subject}`,
                                value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Personal Information
                    </h3>
                    <div className="grid sm:grid-cols-5 grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Rank
                        </label>
                        <Field
                          type="number"
                          name="personalInfo.rank"
                          placeholder="Enter your rank"
                          className={`w-full bg-gray-800 text-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.personalInfo?.rank &&
                            touched.personalInfo?.rank
                              ? "border-red-500"
                              : "border-gray-600"
                          }`}
                        />
                        <ErrorMessage
                          name="personalInfo.rank"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Z-Score *
                        </label>
                        <Field
                          type="number"
                          step="0.0001"
                          name="personalInfo.zScore"
                          placeholder="Enter your z-score"
                          className={`w-full bg-gray-800 text-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.personalInfo?.zScore &&
                            touched.personalInfo?.zScore
                              ? "border-red-500"
                              : "border-gray-600"
                          }`}
                        />
                        <ErrorMessage
                          name="personalInfo.zScore"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <DropDown
                          label="Stream *"
                          options={streams}
                          isStream={true}
                          onSelect={(value) =>
                            setFieldValue("personalInfo.stream", value)
                          }
                        />
                        <ErrorMessage
                          name="personalInfo.stream"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <DropDown
                          label="District *"
                          options={districts}
                          isDistric={true}
                          onSelect={(value) =>
                            setFieldValue("personalInfo.district", value)
                          }
                        />
                        <ErrorMessage
                          name="personalInfo.district"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Exam Year *
                        </label>
                        <Field
                          type="number"
                          name="personalInfo.examYear"
                          placeholder="Enter exam year"
                          className={`w-full bg-gray-800 text-white border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.personalInfo?.examYear &&
                            touched.personalInfo?.examYear
                              ? "border-red-500"
                              : "border-gray-600"
                          }`}
                        />
                        <ErrorMessage
                          name="personalInfo.examYear"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="mt-5 mb-10 flex border border-gray-700 p-5 rounded-lg bg-gray-800">
                    <label className="flex items-center text-white space-x-2">
                      <input
                        type="checkbox"
                        checked={showExtra}
                        onChange={(e) => setShowExtra(e.target.checked)}
                        className="form-checkbox h-5 w-5 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                      <span className="text-m font-medium text-gray-300">
                        Enable this option to display cross-stream courses and universities in the table.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isProcessing || !isValid}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center gap-3 text-lg shadow-lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-3">
                          <svg
                            className="animate-spin w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          Find Universities
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* University Results Section */}
              {showResults && (
                <div id="universities" className="max-w-6xl mx-auto px-6 mb-12">
                  {isLowScore(values) ? (
                    <div className="bg-gray-800 rounded-xl p-8 border border-red-700 shadow-lg mb-8 text-center">
                      <div className="text-red-400 text-lg font-semibold flex items-center justify-center gap-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Your Common General Test score is too low! Please enter a score greater than 30.
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Stream-Specific Results */}
                      <div
                        id="stream-universities"
                        className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg mb-8"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white">
                                Stream-Specific Recommendations
                              </h2>
                              <p className="text-gray-400">
                                Your personalized university matches for{" "}
                                {streamResults.length
                                  ? streamResults[0]?.stream || values.personalInfo.stream
                                  : values.personalInfo.stream}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handlePrint}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                              />
                            </svg>
                            Print Results
                          </button>
                        </div>
                        {streamResults.length > 0 ? (
                          <div ref={streamTableRef}>
                            <Table tableData={streamResults} />
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="text-gray-400 text-lg">
                              No stream-specific recommendations found
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cross Stream Results */}
                      {showExtra && (
                        <div
                          id="cross-stream-universities"
                          className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-white">
                                  Cross Stream Recommendations
                                </h2>
                                <p className="text-gray-400">
                                  Courses available to all streams
                                </p>
                              </div>
                            </div>
                          </div>
                          {crossStreamResults.length > 0 ? (
                            <div ref={crossStreamTableRef}>
                              <Table tableData={crossStreamResults} />
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="text-gray-400 text-lg">
                                No Cross Stream recommendations found
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
      <Footer />
    </>
  );
}