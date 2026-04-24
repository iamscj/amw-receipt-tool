import { useState, useEffect } from 'react';
import { Download, FileText, Edit2, Trash2, Download as DownloadIcon, X } from 'lucide-react';
import { getAllReceipts, updateReceipt, deleteReceipt, type ReceiptDocument } from '../services/firebase';
import { isAdmin } from '../services/auth';
import { pdf } from '@react-pdf/renderer';
import { AllReceiptsPDF } from '../components/AllReceiptsPDF';
import { ReceiptPDF } from '../components/ReceiptPDF';
import { Toast } from '../components/Toast';
import { formatIndianNumber } from '../utils/formatIndianNumber';
import '../styles/ReceiptsList.css';

export function ReceiptsList() {
  const [receipts, setReceipts] = useState<ReceiptDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const userIsAdmin = isAdmin();

  // Edit modal state
  const [editingReceipt, setEditingReceipt] = useState<ReceiptDocument | null>(null);
  const [editForm, setEditForm] = useState({
    ownerName: '',
    wing: '',
    flat: '',
    amount: '',
    mode: '',
    purpose: '',
  });

  // Delete confirmation state
  const [deletingReceipt, setDeletingReceipt] = useState<ReceiptDocument | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function fetchReceipts() {
      setLoading(true);
      try {
        const data = await getAllReceipts();
        setReceipts(data);
      } catch (err) {
        console.error('Error fetching receipts:', err);
        setError('Failed to load receipts. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    fetchReceipts();
  }, []);

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const blob = await pdf(<AllReceiptsPDF receipts={receipts} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AMW_All_Receipts_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setToast({ message: 'All receipts exported successfully!', type: 'success' });
    } catch (error) {
      console.error('Error exporting receipts:', error);
      setToast({ message: 'Failed to export receipts. Please try again.', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle individual receipt download
  const handleDownloadReceipt = async (receipt: ReceiptDocument) => {
    try {
      const receiptData = {
        receiptNo: receipt.receiptNo.toString(),
        date: receipt.date,
        ownerName: receipt.ownerName,
        wing: receipt.wing,
        flat: receipt.flat,
        amount: receipt.amount,
        amountInWords: receipt.amountInWords,
        mode: receipt.mode,
        purpose: receipt.purpose,
      };

      const blob = await pdf(<ReceiptPDF data={receiptData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AMW_Receipt_${receipt.receiptNo}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setToast({ message: 'Receipt downloaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setToast({ message: 'Failed to download receipt. Please try again.', type: 'error' });
    }
  };

  // Handle edit button click
  const handleEditClick = (receipt: ReceiptDocument) => {
    setEditingReceipt(receipt);
    setEditForm({
      ownerName: receipt.ownerName,
      wing: receipt.wing,
      flat: receipt.flat,
      amount: receipt.amount,
      mode: receipt.mode,
      purpose: receipt.purpose,
    });
  };

  // Handle edit form submission
  const handleEditSave = async () => {
    if (!editingReceipt || !editingReceipt.id) return;

    try {
      await updateReceipt(editingReceipt.id, editForm);

      // Update local state
      setReceipts(receipts.map(r =>
        r.id === editingReceipt.id
          ? { ...r, ...editForm }
          : r
      ));

      setEditingReceipt(null);
      setToast({ message: 'Receipt updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating receipt:', error);
      setToast({ message: 'Failed to update receipt. Please try again.', type: 'error' });
    }
  };

  // Handle delete button click
  const handleDeleteClick = (receipt: ReceiptDocument) => {
    setDeletingReceipt(receipt);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingReceipt || !deletingReceipt.id) return;

    try {
      await deleteReceipt(deletingReceipt.id);

      // Update local state
      setReceipts(receipts.filter(r => r.id !== deletingReceipt.id));

      setDeletingReceipt(null);
      setToast({ message: 'Receipt deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting receipt:', error);
      setToast({ message: 'Failed to delete receipt. Please try again.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="receipts-container">
        <div className="loading-state">
          <div className="spinner-large" />
          <p>Loading receipts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="receipts-container">
        <div className="error-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="receipts-container">
      <div className="receipts-header">
        <div>
          <h2 className="receipts-title">
            <FileText className="title-icon" />
            All Receipts
          </h2>
          <p className="receipts-count">Total: {receipts.length} receipts</p>
        </div>
        <button
          onClick={handleExportAll}
          disabled={isExporting || receipts.length === 0}
          className="export-button"
        >
          {isExporting ? (
            <>
              <div className="spinner-small" />
              Exporting...
            </>
          ) : (
            <>
              <Download />
              Export All to PDF
            </>
          )}
        </button>
      </div>

      {receipts.length === 0 ? (
        <div className="empty-state">
          <FileText className="empty-icon" />
          <p>No receipts found</p>
          <p className="empty-hint">Generate your first receipt to see it here</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="receipts-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Date</th>
                <th>Owner Name</th>
                <th>Wing</th>
                <th>Flat</th>
                <th>Amount (₹)</th>
                <th>Mode</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.receiptNo}>
                  <td data-label="Receipt No">{receipt.receiptNo}</td>
                  <td data-label="Date">{receipt.date}</td>
                  <td data-label="Owner Name">{receipt.ownerName}</td>
                  <td data-label="Wing">{receipt.wing}</td>
                  <td data-label="Flat">{receipt.flat}</td>
                  <td data-label="Amount">₹{formatIndianNumber(receipt.amount)}</td>
                  <td data-label="Mode">{receipt.mode}</td>
                  <td data-label="Purpose" className="purpose-cell">
                    {receipt.purpose}
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleDownloadReceipt(receipt)}
                        className="action-btn download-btn"
                        title="Download"
                      >
                        <DownloadIcon size={16} />
                      </button>
                      {userIsAdmin && (
                        <>
                          <button
                            onClick={() => handleEditClick(receipt)}
                            className="action-btn edit-btn"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(receipt)}
                            className="action-btn delete-btn"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingReceipt && (
        <div className="modal-overlay" onClick={() => setEditingReceipt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Receipt #{editingReceipt.receiptNo}</h2>
              <button
                className="modal-close"
                onClick={() => setEditingReceipt(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-form">
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    value={editForm.ownerName}
                    onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Wing</label>
                    <select
                      value={editForm.wing}
                      onChange={(e) => setEditForm({ ...editForm, wing: e.target.value })}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Flat No.</label>
                    <input
                      type="text"
                      value={editForm.flat}
                      onChange={(e) => setEditForm({ ...editForm, flat: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    min="1"
                    max="100000000"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Mode</label>
                  <select
                    value={editForm.mode}
                    onChange={(e) => setEditForm({ ...editForm, mode: e.target.value })}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Purpose</label>
                  <textarea
                    value={editForm.purpose}
                    onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setEditingReceipt(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn save-btn"
                onClick={handleEditSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingReceipt && (
        <div className="modal-overlay" onClick={() => setDeletingReceipt(null)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Receipt</h2>
              <button
                className="modal-close"
                onClick={() => setDeletingReceipt(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to delete Receipt #{deletingReceipt.receiptNo}?
              </p>
              <p className="delete-info">
                Owner: {deletingReceipt.ownerName} | Flat: {deletingReceipt.flat} | Amount: ₹{formatIndianNumber(deletingReceipt.amount)}
              </p>
              <p className="delete-note">
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setDeletingReceipt(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn delete-confirm-btn"
                onClick={handleDeleteConfirm}
              >
                Delete Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
