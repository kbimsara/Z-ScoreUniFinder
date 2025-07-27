'use client';
import NavBar from "@/components/nav/NavBar";
import DropDown from "@/components/dropdown/DropDown";
import SearchableDropDown from "@/components/dropdown/SearchableDropDown";
import Table from "@/components/table/Table";
import Footer from "@/components/footer/Footer";
import './globals.css'

import { useRef, useState } from 'react';

export default function Home() {

  const tableRef = useRef();

  // A/L Subjects array
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
    "General Information Technology"
  ];

  // State for form data
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentSearchSubject, setCurrentSearchSubject] = useState('');
  const [olResults, setOlResults] = useState({
    mathematics: '',
    english: '',
    science: '',
    sinhala: '',
    tamil: ''
  });
  const [additionalSubjects, setAdditionalSubjects] = useState({
    commonGeneralTest: '',
    git: '',
    generalEnglish: ''
  });
  const [personalInfo, setPersonalInfo] = useState({
    district: '',
    rank: '',
    zScore: ''
  });
  const [universityResults, setUniversityResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAddSubject = (subject) => {
    if (subject && !selectedSubjects.find(s => s.name === subject)) {
      setSelectedSubjects([...selectedSubjects, { name: subject, grade: '' }]);
      setCurrentSearchSubject('');
    }
  };

  const handleGradeChange = (subjectName, grade) => {
    setSelectedSubjects(selectedSubjects.map(subject => 
      subject.name === subjectName ? { ...subject, grade } : subject
    ));
  };

  const handleRemoveSubject = (subjectName) => {
    setSelectedSubjects(selectedSubjects.filter(subject => subject.name !== subjectName));
  };

  const handleOlGradeChange = (subject, grade) => {
    setOlResults(prev => ({
      ...prev,
      [subject]: grade
    }));
  };

  const handleAdditionalSubjectChange = (subject, value) => {
    setAdditionalSubjects(prev => ({
      ...prev,
      [subject]: value
    }));
  };

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to collect all form data
  const collectFormData = () => {
    return {
      olResults,
      alResults: selectedSubjects,
      additionalSubjects,
      personalInfo
    };
  };

  // Function to call ML model API
  const findUniversities = async () => {
    setIsProcessing(true);
    
    try {
      const formData = collectFormData();
      
      // TODO: Replace with your actual ML model API endpoint
      // const response = await fetch('/api/predict-universities', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const results = await response.json();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - replace this with actual API response
      const mockResults = [
        {
          name: "University of Moratuwa (UOM)",
          zScore: "1.2345",
          province: "Western",
          eligible: true,
          matchPercentage: 85,
          requirements: "Engineering, Technology"
        },
        {
          name: "University of Colombo (UOC)",
          zScore: "1.2345",
          province: "Western",
          eligible: true,
          matchPercentage: 78,
          requirements: "Arts, Science, Medicine"
        },
        {
          name: "University of Kelaniya (UOK)",
          zScore: "1.2345",
          province: "Western",
          eligible: true,
          matchPercentage: 92,
          requirements: "Arts, Science, Humanities"
        },
        {
          name: "University of Peradeniya (UOP)",
          zScore: "1.2345",
          province: "Central",
          eligible: false,
          matchPercentage: 45,
          requirements: "Arts, Science, Agriculture"
        }
      ];

      setUniversityResults(mockResults);
      setShowResults(true);
      
      // Scroll to results section
      document.getElementById('universities').scrollIntoView({ behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error calling ML model:', error);
      // Handle error - show user-friendly message
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    const printContents = tableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>University List</title>');
    printWindow.document.write('<style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 8px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <NavBar />
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Home Section */}
        <div id="home" className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to <span className="text-blue-400">Z-Score</span> University Finder
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Find your perfect university match using AI-powered Z-score analysis. 
              Get personalized recommendations based on your academic performance.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                <div className="text-gray-400">Universities</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">48</div>
                <div className="text-gray-400">A/L Subjects</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">AI</div>
                <div className="text-gray-400">Powered Matching</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* O/L Results Section */}
        <div id="ol-results" className="max-w-6xl mx-auto px-6 mb-12">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">O/L Results</h2>
                <p className="text-gray-400">Select your Ordinary Level examination results</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-5 grid-cols-1 gap-6">
              <div>
                <DropDown 
                  label={"Mathematics"} 
                  onSelect={(grade) => handleOlGradeChange('mathematics', grade)}
                />
              </div>
              <div>
                <DropDown 
                  label={"English"} 
                  onSelect={(grade) => handleOlGradeChange('english', grade)}
                />
              </div>
              <div>
                <DropDown 
                  label={"Science"} 
                  onSelect={(grade) => handleOlGradeChange('science', grade)}
                />
              </div>
              <div>
                <DropDown 
                  label={"Sinhala"} 
                  onSelect={(grade) => handleOlGradeChange('sinhala', grade)}
                />
              </div>
              <div>
                <DropDown 
                  label={"Tamil"} 
                  onSelect={(grade) => handleOlGradeChange('tamil', grade)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* A/L Results Section */}
        <div id="al-results" className="max-w-6xl mx-auto px-6 mb-12">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">A/L Results</h2>
                <p className="text-gray-400">Add your Advanced Level subjects and grades</p>
              </div>
            </div>
            
            {/* Subject Search and Add */}
            <div className="mb-8">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <SearchableDropDown 
                    label="Search Subject" 
                    options={alSubjects}
                    onSelect={(subject) => setCurrentSearchSubject(subject)}
                  />
                </div>
                <button 
                  onClick={() => handleAddSubject(currentSearchSubject)}
                  disabled={!currentSearchSubject}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Subject
                </button>
              </div>
            </div>

            {/* Selected Subjects with Grades */}
            {selectedSubjects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Selected Subjects</h3>
                <div className="space-y-3">
                  {selectedSubjects.map((subject, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:bg-gray-600 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <span className="text-white font-medium">{subject.name}</span>
                        </div>
                        <div className="w-32">
                          <DropDown 
                            label="Grade"
                            onSelect={(grade) => handleGradeChange(subject.name, grade)}
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveSubject(subject.name)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Subjects */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Subjects</h3>
              <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Common General Test
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your result"
                    value={additionalSubjects.commonGeneralTest}
                    onChange={(e) => handleAdditionalSubjectChange('commonGeneralTest', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <DropDown 
                    label="GIT (General Information Technology)" 
                    options={['A', 'B', 'C', 'S', 'F']}
                    onSelect={(grade) => handleAdditionalSubjectChange('git', grade)}
                  />
                </div>
                <div>
                  <DropDown 
                    label="General English" 
                    options={['A', 'B', 'C', 'S', 'F']}
                    onSelect={(grade) => handleAdditionalSubjectChange('generalEnglish', grade)}
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your district"
                    value={personalInfo.district}
                    onChange={(e) => handlePersonalInfoChange('district', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rank
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your rank"
                    value={personalInfo.rank}
                    onChange={(e) => handlePersonalInfoChange('rank', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Z-Score
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Enter your Z-Score"
                    value={personalInfo.zScore}
                    onChange={(e) => handlePersonalInfoChange('zScore', e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={findUniversities}
                disabled={isProcessing || selectedSubjects.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center gap-3 text-lg shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Universities
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Universities Section */}
        <div id="universities" className="max-w-6xl mx-auto px-6 mb-12">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">University Recommendations</h2>
                  <p className="text-gray-400">Your personalized university matches</p>
                </div>
              </div>
              {showResults && (
                <button 
                  onClick={handlePrint} 
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Results
                </button>
              )}
            </div>
            
            {!showResults ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  Click "Find Universities" to see your personalized recommendations
                </div>
              </div>
            ) : (
              <div ref={tableRef}>
                <Table tableData={universityResults.map((uni, index) => ({
                  no: (index + 1).toString().padStart(2, '0'),
                  university: uni.name,
                  zScore: uni.zScore,
                  province: uni.province,
                  action: (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        uni.eligible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {uni.eligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                      <a href="#" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
                        View Details
                      </a>
                    </div>
                  )
                }))} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
