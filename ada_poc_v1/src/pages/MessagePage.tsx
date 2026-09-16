import { useState, useMemo } from 'react';
import type { Message } from '../types';
import {
  Button, Badge, FormField, SelectField, ConfirmDelete,
  Pagination, SearchBar, PageHeader, SectionCard, Tabs,
  useSortTable, EmptyState, useToasts, ToastContainer,
} from '../components/UI';
import { messages as initialData, messageTypes, remoteTerminals, words } from '../mockData';

type ViewMode = 'list' | 'view' | 'add' | 'edit';

const empty: Omit<Message, 'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedBy'> = {
  LRU_Name: '', IcdVersionId: '', AmndNo: '', MessageName: '', MessageNo: '',
  MessageAliasName: '', MessageTypeId: 1, MuxIdxId: '00', MsgDescription: '', BlockId: '',
};

export default function MessagePage() {
  const [data, setData] = useState<Message[]>(initialData);
  const [view, setView] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof empty>({ ...empty });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [detailTab, setDetailTab] = useState('details');
  const { sort, toggleSort, SortIcon } = useSortTable('MessageName');
  const { toasts, addToast, removeToast } = useToasts();

  const selected = data.find(r => r.Id === selectedId);
  const rtList = remoteTerminals.map(r => ({ value: r.LRU_Name, label: r.LRU_Name }));
  const typeList = messageTypes.map(t => ({ value: t.MessageTypeId, label: `${t.TypeName} — ${t.Description}` }));

  const validate = (f: typeof empty) => {
    const e: Partial<Record<keyof typeof empty, string>> = {};
    if (!f.LRU_Name) e.LRU_Name = 'Required';
    if (!f.MessageName) e.MessageName = 'Required';
    if (!f.MessageNo) e.MessageNo = 'Required';
    return e;
  };

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(r =>
        r.MessageName.toLowerCase().includes(s) ||
        r.MessageNo.toLowerCase().includes(s) ||
        r.LRU_Name.toLowerCase().includes(s)
      );
    }
    if (filterType) rows = rows.filter(r => r.MessageTypeId === Number(filterType));
    rows.sort((a, b) => {
      const av = (a as any)[sort.key] ?? '';
      const bv = (b as any)[sort.key] ?? '';
      return sort.direction === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [data, search, filterType, sort]);

  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
  const relatedWords = selected ? words.filter(w => w.MessageId === selected.Id) : [];

  const handleSave = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (view === 'add') {
      const newId = Math.max(...data.map(r => r.Id)) + 1;
      setData(prev => [...prev, { ...form, Id: newId, CreatedAt: new Date().toISOString(), CreatedBy: 'jsmith', UpdatedBy: 'jsmith' }]);
      addToast('success', `Message "${form.MessageName}" added`);
    } else {
      setData(prev => prev.map(r => r.Id === selectedId ? { ...r, ...form } : r));
      addToast('success', `Message "${form.MessageName}" updated`);
    }
    setView('list');
  };

  const typeName = (id: number) => messageTypes.find(t => t.MessageTypeId === id)?.TypeName ?? `Type ${id}`;

  if (view === 'view' && selected) {
    return (
      <div>
        <PageHeader title={selected.MessageName} subtitle={`Message · ${selected.LRU_Name}`}
          actions={<>
            <Button variant="secondary" size="sm" onClick={() => setView('list')}>← Back</Button>
            <Button variant="secondary" size="sm" onClick={() => {
              const { Id, CreatedAt, CreatedBy, UpdatedBy, ...rest } = selected;
              setForm({ ...rest }); setErrors({}); setView('edit');
            }}>Edit</Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteId(selected.Id)}>Delete</Button>
          </>}
        />
        <div style={{ padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <Tabs tabs={[
              { id: 'details', label: 'Details' },
              { id: 'words', label: 'Words', count: relatedWords.length },
              { id: 'system', label: 'System Info' },
            ]} active={detailTab} onChange={setDetailTab} />
            <div style={{ padding: 20 }}>
              {detailTab === 'details' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[
                    ['LRU Name', selected.LRU_Name],
                    ['Message Name', selected.MessageName],
                    ['Message No.', selected.MessageNo],
                    ['Alias Name', selected.MessageAliasName],
                    ['Message Type', typeName(selected.MessageTypeId)],
                    ['MUX Index', selected.MuxIdxId],
                    ['ICD Version', selected.IcdVersionId],
                    ['Amendment No.', selected.AmndNo],
                    ['Block ID', selected.BlockId],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>{v || '—'}</span>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</span>
                    <span style={{ fontSize: 13 }}>{selected.MsgDescription || '—'}</span>
                  </div>
                </div>
              )}
              {detailTab === 'words' && (
                relatedWords.length === 0 ? <EmptyState message="No words linked to this message." /> :
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--border)' }}>
                    {['Word Name', 'Word No', 'Bit Start', 'Bit End', 'Description'].map(h => (
                      <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 10.5, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{relatedWords.map((w, i) => (
                    <tr key={w.Id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'var(--slate-50)' : '#fff' }}>
                      <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{w.WordName}</td>
                      <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{w.WordNo}</td>
                      <td style={{ padding: '8px 12px', fontSize: 12 }}>{w.BitStart}</td>
                      <td style={{ padding: '8px 12px', fontSize: 12 }}>{w.BitEnd}</td>
                      <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{w.Description}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
              {detailTab === 'system' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 400 }}>
                  {[['ID', String(selected.Id)], ['Created By', selected.CreatedBy], ['Created At', new Date(selected.CreatedAt).toLocaleString()], ['Updated By', selected.UpdatedBy]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                      <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <ConfirmDelete open={deleteId !== null} name={selected.MessageName}
          onConfirm={() => { setData(prev => prev.filter(r => r.Id !== deleteId)); setDeleteId(null); setView('list'); addToast('success', 'Message deleted'); }}
          onCancel={() => setDeleteId(null)} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  if (view === 'add' || view === 'edit') {
    return (
      <div>
        <PageHeader title={view === 'add' ? 'Add Message' : `Edit: ${selected?.MessageName}`} subtitle="Message Maintenance"
          actions={<>
            <Button variant="secondary" size="sm" onClick={() => setView(view === 'edit' ? 'view' : 'list')}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave}>Save Record</Button>
          </>}
        />
        <div style={{ padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 4, padding: 24, maxWidth: 900 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <SelectField label="LRU Name" value={form.LRU_Name} onChange={v => setForm(f => ({ ...f, LRU_Name: v }))}
                options={rtList} required error={errors.LRU_Name} />
              <FormField label="Message Name" value={form.MessageName} onChange={v => setForm(f => ({ ...f, MessageName: v }))}
                required placeholder="e.g. FLIGHT_CTRL_CMD" error={errors.MessageName} />
              <FormField label="Message No." value={form.MessageNo} onChange={v => setForm(f => ({ ...f, MessageNo: v }))}
                required placeholder="e.g. M0001" error={errors.MessageNo} />
              <FormField label="Alias Name" value={form.MessageAliasName} onChange={v => setForm(f => ({ ...f, MessageAliasName: v }))}
                placeholder="e.g. FCC_CMD_1" />
              <SelectField label="Message Type" value={form.MessageTypeId} onChange={v => setForm(f => ({ ...f, MessageTypeId: Number(v) }))}
                options={typeList} required />
              <FormField label="MUX Index ID" value={form.MuxIdxId} onChange={v => setForm(f => ({ ...f, MuxIdxId: v }))}
                placeholder="e.g. 00" />
              <FormField label="ICD Version ID" value={form.IcdVersionId} onChange={v => setForm(f => ({ ...f, IcdVersionId: v }))}
                placeholder="e.g. ICD-FCC-3.2" />
              <FormField label="Amendment No." value={form.AmndNo} onChange={v => setForm(f => ({ ...f, AmndNo: v }))}
                placeholder="e.g. A03" />
              <FormField label="Block ID" value={form.BlockId} onChange={v => setForm(f => ({ ...f, BlockId: v }))}
                placeholder="e.g. BLK-001" />
            </div>
            <div style={{ marginTop: 16 }}>
              <FormField label="Message Description" value={form.MsgDescription} onChange={v => setForm(f => ({ ...f, MsgDescription: v }))}
                placeholder="Describe the purpose of this message..." rows={3} />
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Message Maintenance" subtitle={`${data.length} messages · Ada.dbo.Message`}
        actions={<>
          <Button variant="secondary" size="sm">⬇ Export</Button>
          <Button variant="primary" size="sm" onClick={() => { setForm({ ...empty }); setErrors({}); setView('add'); }}>+ Add Message</Button>
        </>}
      />
      <div style={{ padding: '10px 16px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search messages..." />
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} style={{ padding: '6px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 12.5, background: '#fff' }}>
          <option value="">All Types</option>
          {messageTypes.map(t => <option key={t.MessageTypeId} value={t.MessageTypeId}>{t.TypeName}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} results</span>
      </div>
      <SectionCard style={{ margin: 16, marginTop: 12 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--border-strong)' }}>
                {[['LRU_Name','LRU Name'], ['MessageName','Message Name'], ['MessageNo','Msg No'], ['MessageTypeId','Type'], ['MuxIdxId','MUX'], ['IcdVersionId','ICD Ver'], ['BlockId','Block ID']].map(([key, label]) => (
                  <th key={key} style={{ padding: '8px 12px', textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => toggleSort(key)}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}<SortIcon col={key} /></span>
                  </th>
                ))}
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={8}><EmptyState message="No messages found." action={<Button variant="primary" onClick={() => { setForm({ ...empty }); setErrors({}); setView('add'); }}>+ Add Message</Button>} /></td></tr>
              ) : pageData.map((m, i) => (
                <tr key={m.Id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--slate-50)', cursor: 'pointer' }}>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }} onClick={() => { setSelectedId(m.Id); setDetailTab('details'); setView('view'); }}>{m.LRU_Name}</td>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--navy-700)', fontWeight: 600 }} onClick={() => { setSelectedId(m.Id); setDetailTab('details'); setView('view'); }}>{m.MessageName}</td>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }} onClick={() => { setSelectedId(m.Id); setDetailTab('details'); setView('view'); }}>{m.MessageNo}</td>
                  <td style={{ padding: '8px 12px' }}><Badge variant="info">{typeName(m.MessageTypeId)}</Badge></td>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{m.MuxIdxId}</td>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{m.IcdVersionId}</td>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{m.BlockId}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedId(m.Id); setDetailTab('details'); setView('view'); }}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => { const { Id, CreatedAt, CreatedBy, UpdatedBy, ...rest } = m; setForm({ ...rest }); setErrors({}); setSelectedId(m.Id); setView('edit'); }}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(m.Id)}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={n => { setPageSize(n); setPage(1); }} />
      </SectionCard>
      <ConfirmDelete open={deleteId !== null} name={data.find(r => r.Id === deleteId)?.MessageName ?? ''}
        onConfirm={() => { setData(prev => prev.filter(r => r.Id !== deleteId)); setDeleteId(null); addToast('success', 'Message deleted'); }}
        onCancel={() => setDeleteId(null)} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
