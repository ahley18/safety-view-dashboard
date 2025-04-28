
import React from 'react';
import { PPERecord } from '../../data/mockData';
import { format } from 'date-fns';

interface PPEDataTableProps {
  data: PPERecord[];
}

const ComplianceStatus: React.FC<{ isCompliant: boolean }> = ({ isCompliant }) => {
  return isCompliant ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      ✓ Compliant
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
      ✕ Non-compliant
    </span>
  );
};

const PPEDataTable: React.FC<PPEDataTableProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No records found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Area
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Helmet
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vest
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Boots
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{record.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.action === 'entry' ? (
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Entry</span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Exit</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(record.timestamp), 'MMM d, yyyy h:mm a')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {record.area}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ComplianceStatus isCompliant={record.compliance.helmet} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ComplianceStatus isCompliant={record.compliance.vest} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ComplianceStatus isCompliant={record.compliance.boots} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PPEDataTable;
