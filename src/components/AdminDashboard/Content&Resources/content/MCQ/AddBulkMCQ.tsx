import CommonBorderWrapper from "@/common/space/CommonBorderWrapper";
import {
  useAddMoreMcqToMcqBankMutation,
  useCheckBulkDuplicatesMCQMutation,
  useUploadBulkMcqApiMutation,
} from "@/store/features/adminDashboard/ContentResources/MCQ/mcqApi";
import { setUploadIntoBank } from "@/store/features/adminDashboard/staticContent/staticContentSlice";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../ActionButtons";
import RequiredColumnsList from "../medical/studyMode/RequiredColumsList";
import UploadDropzone from "../medical/studyMode/UpdateDropZone";
import UploadPreview from "../medical/studyMode/UploadPreview";
import { useEffect } from "react";
// import { useDebounce } from "@/common/custom/useDebounce";

export const columns = [
  { label: "Question", description: "The question text" },
  {
    label: "Image Description",
    description: "Description of the question image (if any)",
  },

  { label: "Option A", description: "First answer option" },
  { label: "Explanation A", description: "Explanation for option A" },

  { label: "Option B", description: "Second answer option" },
  { label: "Explanation B", description: "Explanation for option B" },

  { label: "Option C", description: "Third answer option" },
  { label: "Explanation C", description: "Explanation for option C" },

  { label: "Option D", description: "Fourth answer option" },
  { label: "Explanation D", description: "Explanation for option D" },

  { label: "Correct Option", description: "Correct answer: A, B, C, or D" },
  { label: "Difficulty", description: "Basic, Intermediate, or Advanced" },
];
import { AlertTriangle } from "lucide-react";

// import { SimilarMatch } from "@/store/features/adminDashboard/ContentResources/MCQ/types/mcq"; // adjust path

const AddBulkMCQ = () => {
  const [detectedCount, setDetectedCount] = useState(0);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<Record<number, any[]>>({});


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  const {
    contentType,
    formData: selectFormData,
    bankId,
    uploadIntoBank,
  } = useSelector((state: RootState) => state.staticContent);

  const [uploadBulkMcqApi, { isLoading: isUploading }] =
    useUploadBulkMcqApiMutation();

  const [addMoreMcqToMcqBank, { isLoading: isAdding }] =
    useAddMoreMcqToMcqBankMutation();

  const [checkBulkDuplicatesMCQ] = useCheckBulkDuplicatesMCQMutation();

const debouncedRows = parsedRows; // Disabled debounce for debugging - setDuplicates immediately
  
  useEffect(() => {
    if (debouncedRows.length === 0) {
      setDuplicates({});
      return;
    }
    
    const checkDuplicates = async () => {
      setIsCheckingDuplicates(true);
      try {
        const questions = debouncedRows.map(row => row["Question"]?.trim() || '').filter(q => q.length > 10);
        if (questions.length === 0) return;
        
        const result = await checkBulkDuplicatesMCQ({
          questions,
          contentFor: selectFormData?.contentFor,
          profileType: selectFormData?.profileType,
          ...(uploadIntoBank && bankId ? { excludeBankId: bankId } : {}),
        }).unwrap();
        
        setDuplicates(result.data.duplicates || {});
      } catch (error) {
        console.error('Duplicate check failed:', error);
        setDuplicates({});
      } finally {
        setIsCheckingDuplicates(false);
      }
    };
    
    checkDuplicates();
  }, [debouncedRows, selectFormData, uploadIntoBank, bankId, checkBulkDuplicatesMCQ]);
  
  const handleFileSelect = (file: File, detectedCount: number, rows: any[]) => {
    console.log('=== HANDLE FILE SELECT DEBUG ===');
    console.log('Input detectedCount:', detectedCount);
    console.log('Input rows.length:', rows?.length);
    console.log('Input rows[0]:', rows[0]);
    console.log('typeof rows:', typeof rows);
    console.log('=== END HANDLE FILE SELECT ===');
    
    // Force state update with timeout to break batching
    setTimeout(() => {
      setSelectedFile(file);
      setDetectedCount(detectedCount);
      setParsedRows(rows || []);
      console.log('STATE SET CALLED');
    }, 0);
    
    console.log(`File uploaded: ${file.name}, rows detected: ${detectedCount}`);
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleImport = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // Check for duplicates
    const totalDuplicates = Object.values(duplicates).reduce((sum, dups) => sum + dups.length, 0);
    if (totalDuplicates > 0) {
      setShowConfirmModal(true);
      return;
    }

    // No duplicates, proceed directly
    await performUpload();
  };

  const performUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile!);

      if (uploadIntoBank && bankId) {
        addMoreMcqToMcqBank({
          mcqBankId: bankId,
          data: formData,
          key: "bulk",
        });
        dispatch(setUploadIntoBank(false));
      } else {
        if (selectFormData) {
          formData.append("data", JSON.stringify(selectFormData));
        }
        await uploadBulkMcqApi(formData);
      }
      navigate(`/admin/content-management/dashboard/${contentType}`);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleConfirmUpload = () => {
    setShowConfirmModal(false);
    setIsConfirmed(true);
    setTimeout(performUpload, 300); // Small delay for smooth UX
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <>
      <CommonBorderWrapper>
        <div className=" pt-6">
          <div className="mx-auto">
            <div className="shadow-sm p-16 mb-6 rounded border border-slate-300 bg-white">
              <UploadDropzone
                label="Upload Question files"
                acceptedFormats=".csv, .xlsx, .xls"
                maxSize="10MB"
                onFileSelect={handleFileSelect}
              />
            </div>

            <RequiredColumnsList columns={columns} />
            <UploadPreview
              detectedCount={detectedCount}
              duplicates={duplicates}
              parsedRows={parsedRows}
              isCheckingDuplicates={isCheckingDuplicates}
              label="Upload Preview"
            />
          </div>
        </div>
      </CommonBorderWrapper>
      
{/* DuplicateConfirmModal temporarily disabled - focus on tooltip fix */}
{showConfirmModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-md shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <h3 className="text-lg font-bold text-gray-900">Duplicates Found</h3>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        {Object.values(duplicates).reduce((sum, dups) => sum + dups.length, 0)} duplicate questions detected.
        <br/>These will be skipped during upload.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button onClick={handleConfirmUpload} className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600">
          Continue Upload
        </button>
      </div>
    </div>
  </div>
)}
      
      <div className="mb-6">
        <ActionButtons
          onSavePublish={handleImport}
          isLoading={isUploading || isAdding || isConfirmed}
          onCancel={handleBack}
        />
      </div>
    </>
  );
};

export default AddBulkMCQ;
