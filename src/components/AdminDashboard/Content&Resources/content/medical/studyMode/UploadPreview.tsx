import React, { useState } from 'react';
import { DuplicateWarningTooltip } from "@/components/AdminDashboard/reuseable/DuplicateWarningTooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface DuplicateInfo {
  mcqId: string;
  bankName?: string;
  examName?: string;
  question: string;
  similarity?: number;
}

interface UploadPreviewProps {
  detectedCount: number;
  duplicates?: Record<number, DuplicateInfo[]>;
  parsedRows?: any[];
  label: string;
  isCheckingDuplicates?: boolean;
}

const UploadPreview: React.FC<UploadPreviewProps> = ({ 
  detectedCount, 
  duplicates = {}, 
  parsedRows = [], 
  label, 
  isCheckingDuplicates = false 
}) => {
  // DEBUG LOGS - Remove after testing
  console.log('=== UPLOAD PREVIEW DEBUG ===');
  console.log('parsedRows.length:', parsedRows?.length);
  console.log('duplicates:', duplicates);
  console.log('totalDuplicates:', Object.keys(duplicates).length);
  for (let i = 0; i < 5; i++) {
    console.log(`Row ${i} duplicates:`, duplicates[i]);
  }
  console.log('DuplicateWarningTooltip imported:', typeof DuplicateWarningTooltip);
  console.log('=== END DEBUG ===');

  const totalDuplicates = Object.keys(duplicates).length;
  const [showAllDuplicates, setShowAllDuplicates] = useState(totalDuplicates > 0);
  
  // Get all duplicate rows first for better preview
  const duplicateRowIndices = Object.keys(duplicates).map(Number);
  const previewRows = parsedRows?.slice(0, duplicateRowIndices.length > 0 ? 10 : 5) || [];
  
  // Collect ALL duplicates for summary
  const allDuplicates = Object.values(duplicates).flat();

  return (
    <div className="shadow-sm p-6 mb-6 rounded border border-slate-300 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-900">{label}</h3>
        <div className="flex items-center gap-2">
          {isCheckingDuplicates ? (
            <span className="text-sm text-blue-600 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Checking duplicates...
            </span>
          ) : (
            <>
              <span className="text-sm text-gray-600">{detectedCount} rows detected</span>
              {totalDuplicates > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-200 shadow-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {totalDuplicates} duplicate(s)
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {parsedRows.length > 0 && (
        <>
          {/* Preview Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium text-gray-900">Question Preview</th>
                  <th className="text-left p-3 font-medium text-gray-900 w-48">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, index) => {
                  const rowDuplicates = duplicates[index] || [];
                  const hasDuplicates = rowDuplicates.length > 0;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        hasDuplicates 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-3 max-w-md">
                        <div className="font-medium text-gray-900 truncate pr-2">
                          {row["Question"]?.substring(0, 100)}{row["Question"]?.length > 100 ? '...' : ''}
                        </div>
                        {row["Image Description"] && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                            📷 Image
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {hasDuplicates ? (
                          <TooltipProvider>
                            <div className="min-h-[32px] flex items-center p-2 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition-colors cursor-pointer">
                              <DuplicateWarningTooltip 
                                duplicates={rowDuplicates} 
                                className="flex items-center gap-1 text-xs font-medium"
                              />
                            </div>
                          </TooltipProvider>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-md border border-green-200">
                            ✅ Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {parsedRows.length > previewRows.length && (
                  <tr>
                    <td colSpan={2} className="p-3 text-center text-gray-500 text-sm bg-gray-50">
                      ... and {parsedRows.length - previewRows.length} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* All Duplicates Summary - Expanded by default if duplicates exist */}
          {totalDuplicates > 0 && (
            <div className="border-t pt-4">
              <button
                onClick={() => setShowAllDuplicates(!showAllDuplicates)}
                className="flex items-center gap-2 w-full mb-3 p-3 text-left bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg hover:shadow-md transition-all text-sm font-medium text-yellow-800"
              >
                {showAllDuplicates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Show {showAllDuplicates ? 'Less' : `All ${totalDuplicates}`} Duplicate Matches ({duplicateRowIndices.length} affected rows)
              </button>
              
              {showAllDuplicates && (
                <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-red-800 bg-red-50 p-2 rounded border-l-4 border-red-400">
                    Duplicate(s) found: {totalDuplicates} matches across {duplicateRowIndices.length} rows. These will be skipped during upload.
                  </p>
                  {allDuplicates.map((dup, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 mb-1">
                            {dup.bankName || dup.examName || 'MCQ Bank'}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">ID: {dup.mcqId}</div>
                          {dup.similarity && (
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2 inline-block font-mono">
                              Similarity: {Math.round(dup.similarity * 100)}%
                            </div>
                          )}
                          <p className="text-sm text-gray-700 italic leading-relaxed line-clamp-2">
                            "{dup.question}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {parsedRows.length === 0 && !isCheckingDuplicates && (
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm font-medium mb-2">Upload a file to see preview</p>
          <p className="text-xs">Supports .csv, .xlsx, .xls (max 10MB)</p>
        </div>
      )}
    </div>
  );
};

export default UploadPreview;