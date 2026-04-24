import { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { ReceiptPDF, type ReceiptData } from './ReceiptPDF';
import { numberToIndianWords } from '../utils/numberToIndianWords';
import { getNextReceiptNumber, saveReceiptToFirebase } from '../services/firebase';

const DEFAULT_PURPOSE = 'Legal & Association Formation Fund';

export function ReceiptForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(true);

  // Form state
  const [receiptNo, setReceiptNo] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [ownerName, setOwnerName] = useState('');
  const [wing, setWing] = useState('');
  const [flat, setFlat] = useState('');
  const [amount, setAmount] = useState('');
  const [amountInWords, setAmountInWords] = useState('');
  const [mode, setMode] = useState('UPI');
  const [purpose, setPurpose] = useState(DEFAULT_PURPOSE);

  // Initialize receipt number
  useEffect(() => {
    async function fetchReceiptNumber() {
      setIsLoadingReceipt(true);
      setStatusMessage('Loading receipt number...');
      try {
        const nextNo = await getNextReceiptNumber();
        setReceiptNo(nextNo.toString());
        setStatusMessage('');
      } catch (error) {
        console.error('Error fetching receipt number:', error);
        setStatusMessage('Failed to load receipt number. Please refresh the page.');
        setReceiptNo('Error');
      } finally {
        setIsLoadingReceipt(false);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    }
    fetchReceiptNumber();
  }, []);

  // Reset loading state when user navigates back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User came back to the tab/page
        setIsGenerating(false);
        setStatusMessage('');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auto-convert amount to words
  useEffect(() => {
    if (amount && amount.trim() !== '') {
      const numAmount = parseInt(amount);

      // Validate: must be integer, positive, and within range
      if (isNaN(numAmount) || numAmount < 1 || numAmount > 100000000) {
        setAmountInWords('');
        return;
      }

      try {
        const words = numberToIndianWords(numAmount);
        setAmountInWords(words);
      } catch (error) {
        console.error('Error converting amount to words:', error);
        setAmountInWords('');
      }
    } else {
      setAmountInWords('');
    }
  }, [amount]);

  const handleGeneratePDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate amount before processing
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount < 1 || numAmount > 100000000) {
      setStatusMessage('Please enter a valid amount (1 to 10 Crores)');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    if (!amountInWords || amountInWords.trim() === '') {
      setStatusMessage('Amount conversion failed. Please re-enter amount.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Processing...');

    try {
      const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const receiptData: ReceiptData = {
        receiptNo,
        date: formattedDate,
        ownerName,
        wing,
        flat,
        amount,
        amountInWords,
        mode,
        purpose,
      };

      // Save receipt data
      try {
        await saveReceiptToFirebase({
          date: formattedDate,
          ownerName,
          wing,
          flat,
          amount,
          amountInWords,
          mode,
          purpose,
        });
        setStatusMessage('Generating receipt...');
      } catch (saveError) {
        console.error('Failed to save receipt:', saveError);
        setStatusMessage('Processing...');
      }

      // Generate PDF
      setStatusMessage('Preparing download...');
      const blob = await pdf(<ReceiptPDF data={receiptData} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Detect device type
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isIOS || isMobile) {
        // Mobile: Open in same tab (user can download from there)
        window.location.href = url;
      } else {
        // Desktop: Direct download
        const link = document.createElement('a');
        link.href = url;
        link.download = `AMW_Receipt_${receiptNo}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        // Fetch next receipt number immediately on desktop
        try {
          const nextNo = await getNextReceiptNumber();
          setReceiptNo(nextNo.toString());
        } catch (error) {
          console.error('Failed to fetch next receipt number:', error);
          setStatusMessage('Warning: Could not load next receipt number. Please refresh.');
        }

        // Reset form on desktop
        setOwnerName('');
        setWing('');
        setFlat('');
        setAmount('');
        setAmountInWords('');
        setMode('UPI');
        setPurpose(DEFAULT_PURPOSE);

        setStatusMessage('Receipt downloaded successfully! ✓');
        setTimeout(() => setStatusMessage(''), 3000);
        setIsGenerating(false);
        return; // Exit early for desktop
      }

      // Fetch next receipt number
      try {
        const nextNo = await getNextReceiptNumber();
        setReceiptNo(nextNo.toString());
      } catch (error) {
        console.error('Failed to fetch next receipt number:', error);
        setStatusMessage('Warning: Could not load next receipt number. Please refresh.');
      }

      // Reset form (keeping receipt number and date)
      setOwnerName('');
      setWing('');
      setFlat('');
      setAmount('');
      setAmountInWords('');
      setMode('UPI');
      setPurpose(DEFAULT_PURPOSE);

      setStatusMessage('Receipt generated successfully! ✓');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error generating receipt:', error);
      setStatusMessage('Failed to generate receipt. Please try again.');
      setTimeout(() => setStatusMessage(''), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Receipt Details</h2>

      <form onSubmit={handleGeneratePDF}>
        {/* Receipt Number and Date */}
        <div className="form-row two-col">
          <div className="form-group">
            <label htmlFor="receiptNo" className="form-label">
              Receipt No
            </label>
            <input
              type="text"
              id="receiptNo"
              value={receiptNo}
              readOnly
              className="form-input form-input-readonly"
              placeholder={isLoadingReceipt ? 'Loading...' : 'Auto-generated'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isLoadingReceipt}
              className="form-input"
            />
          </div>
        </div>

        {/* Owner Name */}
        <div className="form-group">
          <label htmlFor="ownerName" className="form-label">
            Owner Name
          </label>
          <input
            type="text"
            id="ownerName"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
            disabled={isLoadingReceipt}
            className="form-input"
            placeholder="Enter owner name"
          />
        </div>

        {/* Section Divider */}
        <div className="section-divider">
          <h3 className="section-title">Property Details</h3>
        </div>

        {/* Wing & Flat */}
        <div className="form-row two-col">
          <div className="form-group">
            <label htmlFor="wing" className="form-label">
              Wing
            </label>
            <select
              id="wing"
              value={wing}
              onChange={(e) => setWing(e.target.value)}
              required
              disabled={isLoadingReceipt}
              className="form-select"
            >
              <option value="">Select Wing</option>
              <option value="1">Wing 1</option>
              <option value="2">Wing 2</option>
              <option value="3">Wing 3</option>
              <option value="4">Wing 4</option>
              <option value="5">Wing 5</option>
              <option value="6">Wing 6</option>
              <option value="7">Wing 7</option>
              <option value="8">Wing 8</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="flat" className="form-label">
              Flat No.
            </label>
            <input
              type="text"
              id="flat"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              required
              disabled={isLoadingReceipt}
              className="form-input"
              placeholder="e.g. A 001"
            />
          </div>
        </div>

        {/* Section Divider */}
        <div className="section-divider">
          <h3 className="section-title">Payment Information</h3>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow positive integers (no decimals)
              // Remove any decimal point or negative sign
              const cleanValue = value.replace(/[-.]/g, '');

              // Only allow numbers from 1 to 10 crores
              if (cleanValue === '' || (parseInt(cleanValue) >= 1 && parseInt(cleanValue) <= 100000000)) {
                setAmount(cleanValue);
              }
            }}
            required
            min="1"
            max="100000000"
            step="1"
            disabled={isLoadingReceipt}
            className="form-input"
            placeholder="Enter amount (1 to 10 Crores)"
            onKeyDown={(e) => {
              // Prevent decimal point, minus, and scientific notation
              if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* Amount in Words */}
        <div className="form-group">
          <label htmlFor="amountInWords" className="form-label">
            Amount in Words
          </label>
          <div className={`amount-display ${!amountInWords ? 'empty' : ''}`}>
            {amountInWords || 'Auto-generated when you enter amount'}
          </div>
        </div>

        {/* Payment Mode */}
        <div className="form-group">
          <label htmlFor="mode" className="form-label">
            Payment Mode
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            required
            disabled={isLoadingReceipt}
            className="form-select"
          >
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        {/* Purpose */}
        <div className="form-group">
          <label htmlFor="purpose" className="form-label">
            Purpose
          </label>
          <textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            rows={3}
            disabled={isLoadingReceipt}
            className="form-textarea"
            placeholder="Enter purpose of payment"
          />
        </div>

        {/* Status Message */}
        {statusMessage && <div className="status-message">{statusMessage}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || isLoadingReceipt}
          className="submit-button"
        >
          {isGenerating ? (
            <>
              <div className="spinner" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Download />
              <span>Generate & Download Receipt</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

