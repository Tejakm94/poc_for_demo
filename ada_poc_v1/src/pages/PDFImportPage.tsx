import { useState, useRef } from 'react';
import { Button, PageHeader, SectionCard, Badge, Stepper, useToasts, ToastContainer } from '../components/UI';

const STEPS = ['Upload', 'Extract', 'Preview & Validate', 'Save', 'Success'];

interface ImportedRT {
  LRU_Name: string;
  Equipment: string;
  RtAddress: string;
  BusId: string;
  IcdVersionId: string;
  valid: boolean;
  warning?: string;
}

const mockExtracted: ImportedRT[] = [
  { LRU_Name: 'FMC-1', Equipment: 'Flight Management Computer', RtAddress: '03', BusId: 'BUS-A', IcdVersionId: 'ICD-FMC-1.0', valid: true },
  { LRU_Name: 'FMC-2', Equipment: 'Flight Management Computer', RtAddress: '04', BusId: 'BUS-A', IcdVersionId: 'ICD-FMC-1.0', valid: true },
  { LRU_Name: 'IRS-1', Equipment: 'Inertial Reference System', RtAddress: '09', BusId: 'BUS-B', IcdVersionId: 'ICD-IRS-2.1', valid: true, warning: 'RT Address 09 may conflict with existing record' },
  { LRU_Name: 'IRS-2', Equipment: 'Inertial Reference System', RtAddress: '10', BusId: 'BUS-B', IcdVersionId: 'ICD-IRS-2.1', valid: true },
  { LRU_Name: 'DFDR-1', Equipment: 'Digital Flight Data Recorder', RtAddress: '', BusId: 'BUS-C', IcdVersionId: 'ICD-DFDR-1.0', valid: false, warning: 'RT Address is missing — required field' },
];

export default function PDFImportPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [saveProgress, setSaveProgress] = useState(0);
  const [importedData, setImportedData] = useState<ImportedRT[]>(mockExtracted);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toasts, addToast, removeToast } = useToasts();

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.pdf')) { addToast('error', 'Only PDF files are accepted'); return; }
    setFile(f);
  };

  const handleExtract = () => {
    setStep(1);
    setExtractProgress(0);
    const interval = setInterval(() => {
      setExtractProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(2), 400);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 250);
  };

  const handleSave = () => {
    setStep(3);
    setSaveProgress(0);
    const interval = setInterval(() => {
      setSaveProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(4), 400);
          return 100;
        }
        return prev + Math.random() * 18;
      });
    }, 200);
  };

  const validCount = importedData.filter(r => r.valid).length;
  const warningCount = importedData.filter(r => r.warning).length;
  const errorCount = importedData.filter(r => !r.valid).length;

  const reset = () => {
    setStep(0); setFile(null); setExtractProgress(0); setSaveProgress(0);
    setImportedData(mockExtracted);
  };

  return (
    <div>
      <PageHeader title="PDF Import" subtitle="Extract ADA data from ICD PDF documents" />
      <div style={{ padding: '0 24px' }}>
        <Stepper steps={STEPS} current={step} />
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Step 0: Upload */}
        {step === 0 && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <SectionCard style={{ padding: 32 }}>
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? 'var(--navy-500)' : file ? 'var(--accent-green)' : 'var(--border-strong)'}`,
                  borderRadius: 6, padding: '48px 32px', textAlign: 'center', cursor: 'pointer',
                  background: isDragging ? '#eff6ff' : file ? '#f0fdf4' : '#fff',
                  transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  {file ? '✓' : '⊞'}
                </div>
                {file ? (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-green)' }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Drop PDF here or click to browse</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                      Accepts ICD PDF documents (MIL-STD-1553, ARINC 429, CAN)
                    </div>
                  </>
                )}
                <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
              {file && (
                <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ready for extraction · PDF parser v2.4</div>
                    </div>
                    <Button variant="primary" onClick={handleExtract}>Extract Data →</Button>
                  </div>
                </div>
              )}
              {!file && (
                <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <Button variant="secondary" onClick={() => { setFile(new File([''], 'ICD-ADA-v4.1.pdf', { type: 'application/pdf' })); }}>
                    Use Sample PDF
                  </Button>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* Step 1: Extract */}
        {step === 1 && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <SectionCard style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>⬡</div>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Extracting ADA Data</h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 24 }}>
                Parsing {file?.name} · Identifying RT tables, messages, and word definitions...
              </p>
              <div style={{ background: 'var(--slate-200)', borderRadius: 4, height: 8, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'var(--navy-600)', width: `${Math.min(extractProgress, 100)}%`, transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Math.round(Math.min(extractProgress, 100))}%</span>
              <div style={{ marginTop: 16, fontSize: 11.5, color: 'var(--text-muted)' }}>
                {extractProgress < 30 ? 'Scanning PDF structure...' :
                 extractProgress < 60 ? 'Identifying RT definition tables...' :
                 extractProgress < 85 ? 'Parsing message definitions...' :
                 'Validating extracted records...'}
              </div>
            </SectionCard>
          </div>
        )}

        {/* Step 2: Preview & Validate */}
        {step === 2 && (
          <div>
            {/* Validation summary */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#15803d' }}>{validCount}</div>
                <div style={{ fontSize: 12, color: '#15803d' }}>Valid records</div>
              </div>
              <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#b45309' }}>{warningCount}</div>
                <div style={{ fontSize: 12, color: '#b45309' }}>Warnings</div>
              </div>
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#b91c1c' }}>{errorCount}</div>
                <div style={{ fontSize: 12, color: '#b91c1c' }}>Errors (must fix)</div>
              </div>
              <div style={{ padding: '12px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1d4ed8' }}>{importedData.length}</div>
                <div style={{ fontSize: 12, color: '#1d4ed8' }}>Total extracted</div>
              </div>
            </div>

            <SectionCard>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Extracted Remote Terminals — Review &amp; Edit</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" size="sm" onClick={() => setStep(0)}>← Back</Button>
                  <Button variant="primary" size="sm" disabled={errorCount > 0} onClick={handleSave}>
                    {errorCount > 0 ? `Fix ${errorCount} error(s) first` : `Save ${validCount} Records →`}
                  </Button>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--border-strong)' }}>
                    {['Status', 'LRU Name', 'Equipment', 'RT Addr', 'Bus', 'ICD Version', ''].map(h => (
                      <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 10.5, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importedData.map((row, i) => (
                    editingIdx === i ? (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: '#fffbeb' }}>
                        <td style={{ padding: '6px 12px' }}><Badge variant="warning">Editing</Badge></td>
                        {['LRU_Name', 'Equipment', 'RtAddress', 'BusId', 'IcdVersionId'].map(field => (
                          <td key={field} style={{ padding: '4px 8px' }}>
                            <input value={(row as any)[field]} onChange={e => {
                              const updated = [...importedData];
                              updated[i] = { ...updated[i], [field]: e.target.value, valid: true, warning: undefined };
                              setImportedData(updated);
                            }} style={{ width: '100%', padding: '4px 8px', border: '1px solid var(--navy-400)', borderRadius: 3, fontSize: 12, outline: 'none' }} />
                          </td>
                        ))}
                        <td style={{ padding: '4px 12px' }}>
                          <Button variant="primary" size="sm" onClick={() => setEditingIdx(null)}>✓ Done</Button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: !row.valid ? '#fef2f2' : row.warning ? '#fffbeb' : i % 2 === 0 ? '#fff' : 'var(--slate-50)' }}>
                        <td style={{ padding: '8px 12px' }}>
                          {!row.valid ? <Badge variant="error">Error</Badge> : row.warning ? <Badge variant="warning">Warning</Badge> : <Badge variant="success">Valid</Badge>}
                        </td>
                        <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{row.LRU_Name}</td>
                        <td style={{ padding: '8px 12px', fontSize: 12 }}>{row.Equipment}</td>
                        <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                          {row.RtAddress || <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>MISSING</span>}
                        </td>
                        <td style={{ padding: '8px 12px' }}><Badge variant="navy">{row.BusId}</Badge></td>
                        <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{row.IcdVersionId}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <Button variant="ghost" size="sm" onClick={() => setEditingIdx(i)}>Edit</Button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
              {importedData.some(r => r.warning) && (
                <div style={{ padding: '8px 16px', background: '#fffbeb', borderTop: '1px solid #fde68a', fontSize: 12, color: '#b45309' }}>
                  {importedData.filter(r => r.warning).map((r, i) => (
                    <div key={i}>⚠ {r.LRU_Name}: {r.warning}</div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* Step 3: Save */}
        {step === 3 && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <SectionCard style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>💾</div>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Saving to Database</h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 24 }}>
                Writing {validCount} records to Ada.dbo.RemoteTerminal...
              </p>
              <div style={{ background: 'var(--slate-200)', borderRadius: 4, height: 8, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'var(--navy-600)', width: `${Math.min(saveProgress, 100)}%`, transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Math.round(Math.min(saveProgress, 100))}%</span>
            </SectionCard>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <SectionCard style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>✓</div>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Import Complete</h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 24 }}>
                {validCount} records saved to Ada.dbo.RemoteTerminal successfully.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: 4 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#15803d' }}>{validCount}</div>
                  <div style={{ fontSize: 11, color: '#15803d' }}>Saved</div>
                </div>
                <div style={{ padding: '12px', background: '#fffbeb', borderRadius: 4 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#b45309' }}>{warningCount}</div>
                  <div style={{ fontSize: 11, color: '#b45309' }}>With warnings</div>
                </div>
                <div style={{ padding: '12px', background: '#fef2f2', borderRadius: 4 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#b91c1c' }}>{errorCount}</div>
                  <div style={{ fontSize: 11, color: '#b91c1c' }}>Skipped</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Button variant="primary" onClick={reset}>Import Another PDF</Button>
                <Button variant="secondary" onClick={() => addToast('info', 'Opening import log...')}>View Import Log</Button>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
