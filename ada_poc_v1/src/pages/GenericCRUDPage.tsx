import { useState, useMemo } from 'react';
import {
  Button, Badge, FormField, ConfirmDelete,
  Pagination, SearchBar, PageHeader, SectionCard, Tabs,
  useSortTable, EmptyState, useToasts, ToastContainer,
} from '../components/UI';
import { words as wordData, elements as elementData } from '../mockData';

interface Column {
  key: string;
  label: string;
  mono?: boolean;
}

interface Props {
  entityName: string;
  tableName: string;
  columns: Column[];
  schemaNote: string;
  initialData: any[];
  fields: { key: string; label: string; required?: boolean; placeholder?: string; rows?: number }[];
}

function GenericPage({ entityName, tableName, columns, schemaNote, initialData, fields }: Props) {
  const [data, setData] = useState<any[]>(initialData);
  const [view, setView] = useState<'list' | 'view' | 'add' | 'edit'>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [detailTab, setDetailTab] = useState('details');
  const { sort, toggleSort, SortIcon } = useSortTable(columns[0]?.key ?? 'Id');
  const { toasts, addToast, removeToast } = useToasts();

  const selected = data.find(r => r.Id === selectedId);
  const firstField = fields[0]?.key ?? 'Id';

  const validate = (f: Record<string, string>) => {
    const e: Record<string, string> = {};
    fields.filter(fld => fld.required).forEach(fld => {
      if (!f[fld.key]?.trim()) e[fld.key] = 'Required';
    });
    return e;
  };

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(s)));
    }
    rows.sort((a, b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      return sort.direction === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [data, search, sort]);

  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openAdd = () => {
    const empty: Record<string, string> = {};
    fields.forEach(f => { empty[f.key] = ''; });
    setForm(empty); setErrors({}); setView('add');
  };

  const handleSave = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (view === 'add') {
      const newId = data.length > 0 ? Math.max(...data.map((r: any) => r.Id)) + 1 : 1;
      setData(prev => [...prev, { ...form, Id: newId, CreatedAt: new Date().toISOString(), CreatedBy: 'jsmith', UpdatedBy: 'jsmith' }]);
      addToast('success', `${entityName} "${form[firstField]}" added`);
    } else {
      setData(prev => prev.map(r => r.Id === selectedId ? { ...r, ...form } : r));
      addToast('success', `${entityName} "${form[firstField]}" updated`);
    }
    setView('list');
  };

  if (view === 'view' && selected) {
    return (
      <div>
        <PageHeader title={selected[firstField] ?? `${entityName} #${selected.Id}`} subtitle={`${entityName} · ${tableName}`}
          actions={<>
            <Button variant="secondary" size="sm" onClick={() => setView('list')}>← Back</Button>
            <Button variant="secondary" size="sm" onClick={() => {
              const f: Record<string, string> = {};
              fields.forEach(fld => { f[fld.key] = String(selected[fld.key] ?? ''); });
              setForm(f); setErrors({}); setView('edit');
            }}>Edit</Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteId(selected.Id)}>Delete</Button>
          </>}
        />
        <div style={{ padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <Tabs tabs={[{ id: 'details', label: 'Details' }, { id: 'system', label: 'System Info' }]} active={detailTab} onChange={setDetailTab} />
            <div style={{ padding: 20 }}>
              {detailTab === 'details' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {fields.map(fld => (
                    <div key={fld.key} style={{ display: 'flex', flexDirection: 'column', gap: 3, gridColumn: fld.rows ? '1/-1' : undefined }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{fld.label}</span>
                      <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{String(selected[fld.key] ?? '—')}</span>
                    </div>
                  ))}
                </div>
              )}
              {detailTab === 'system' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 400 }}>
                  {[['ID', String(selected.Id)], ['Created By', selected.CreatedBy], ['Created At', selected.CreatedAt ? new Date(selected.CreatedAt).toLocaleString() : ''], ['Updated By', selected.UpdatedBy]].map(([l, v]) => (
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
        <ConfirmDelete open={deleteId !== null} name={String(selected[firstField] ?? selected.Id)}
          onConfirm={() => { setData(prev => prev.filter(r => r.Id !== deleteId)); setDeleteId(null); setView('list'); addToast('success', `${entityName} deleted`); }}
          onCancel={() => setDeleteId(null)} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  if (view === 'add' || view === 'edit') {
    return (
      <div>
        <PageHeader title={view === 'add' ? `Add ${entityName}` : `Edit: ${selected?.[firstField]}`} subtitle={tableName}
          actions={<>
            <Button variant="secondary" size="sm" onClick={() => setView(view === 'edit' ? 'view' : 'list')}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave}>Save Record</Button>
          </>}
        />
        <div style={{ padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 4, padding: 24, maxWidth: 900 }}>
            <div style={{ padding: '8px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, marginBottom: 16, fontSize: 12, color: '#92400e' }}>
              ℹ {schemaNote}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {fields.map(fld => (
                <div key={fld.key} style={{ gridColumn: fld.rows ? '1/-1' : undefined }}>
                  <FormField label={fld.label} value={form[fld.key] ?? ''} onChange={v => setForm(f => ({ ...f, [fld.key]: v }))}
                    required={fld.required} placeholder={fld.placeholder} error={errors[fld.key]} rows={fld.rows} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`${entityName} Maintenance`} subtitle={`${data.length} records · ${tableName}`}
        actions={<>
          <Button variant="secondary" size="sm">⬇ Export</Button>
          <Button variant="primary" size="sm" onClick={openAdd}>+ Add {entityName}</Button>
        </>}
      />
      <div style={{ padding: '8px 16px', background: '#fffbeb', borderBottom: '1px solid #fde68a', fontSize: 12, color: '#92400e' }}>
        ⚠ Schema-dependent module — {schemaNote}
      </div>
      <div style={{ padding: '10px 16px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} />
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} results</span>
      </div>
      <SectionCard style={{ margin: 16, marginTop: 12 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--border-strong)' }}>
                {columns.map(col => (
                  <th key={col.key} style={{ padding: '8px 12px', textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => toggleSort(col.key)}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.label}<SortIcon col={col.key} /></span>
                  </th>
                ))}
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={columns.length + 1}><EmptyState message={`No ${entityName.toLowerCase()}s found.`} action={<Button variant="primary" onClick={openAdd}>+ Add {entityName}</Button>} /></td></tr>
              ) : pageData.map((row, i) => (
                <tr key={row.Id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--slate-50)', cursor: 'pointer' }}>
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '8px 12px', fontSize: 12, fontFamily: col.mono ? 'JetBrains Mono, monospace' : undefined, fontWeight: col.key === columns[0].key ? 600 : 400, color: col.key === columns[0].key ? 'var(--navy-700)' : undefined }}
                      onClick={() => { setSelectedId(row.Id); setDetailTab('details'); setView('view'); }}>
                      {String(row[col.key] ?? '—')}
                    </td>
                  ))}
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedId(row.Id); setDetailTab('details'); setView('view'); }}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => { const f: Record<string, string> = {}; fields.forEach(fld => { f[fld.key] = String(row[fld.key] ?? ''); }); setForm(f); setErrors({}); setSelectedId(row.Id); setView('edit'); }}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(row.Id)}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={filtered.length} page={page} pageSize={pageSize} onPage={setPage} onPageSize={n => { setPageSize(n); setPage(1); }} />
      </SectionCard>
      <ConfirmDelete open={deleteId !== null} name={String(data.find(r => r.Id === deleteId)?.[firstField] ?? deleteId)}
        onConfirm={() => { setData(prev => prev.filter(r => r.Id !== deleteId)); setDeleteId(null); addToast('success', `${entityName} deleted`); }}
        onCancel={() => setDeleteId(null)} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export function WordPage() {
  return (
    <GenericPage
      entityName="Word"
      tableName="Ada.dbo.Word"
      schemaNote="Field definitions are schema-dependent. These fields are representative and should be verified against the actual Ada.bak Word table schema."
      initialData={wordData}
      columns={[
        { key: 'WordName', label: 'Word Name', mono: true },
        { key: 'WordNo', label: 'Word No', mono: true },
        { key: 'MessageId', label: 'Message ID', mono: true },
        { key: 'BitStart', label: 'Bit Start' },
        { key: 'BitEnd', label: 'Bit End' },
        { key: 'Description', label: 'Description' },
      ]}
      fields={[
        { key: 'WordName', label: 'Word Name', required: true, placeholder: 'e.g. AILERON_CMD' },
        { key: 'WordNo', label: 'Word No.', required: true, placeholder: 'e.g. W001' },
        { key: 'MessageId', label: 'Message ID', placeholder: 'Parent Message ID' },
        { key: 'BitStart', label: 'Bit Start', placeholder: 'e.g. 1' },
        { key: 'BitEnd', label: 'Bit End', placeholder: 'e.g. 16' },
        { key: 'Description', label: 'Description', placeholder: 'Word description...', rows: 2 },
      ]}
    />
  );
}

export function ElementPage() {
  return (
    <GenericPage
      entityName="Element"
      tableName="Ada.dbo.Element"
      schemaNote="Field definitions are schema-dependent. These fields are representative and should be verified against the actual Ada.bak Element table schema."
      initialData={elementData}
      columns={[
        { key: 'ElementName', label: 'Element Name', mono: true },
        { key: 'ElementNo', label: 'Element No', mono: true },
        { key: 'WordId', label: 'Word ID', mono: true },
        { key: 'DataType', label: 'Data Type' },
        { key: 'Scale', label: 'Scale' },
        { key: 'Units', label: 'Units' },
      ]}
      fields={[
        { key: 'ElementName', label: 'Element Name', required: true, placeholder: 'e.g. AILERON_ANGLE' },
        { key: 'ElementNo', label: 'Element No.', required: true, placeholder: 'e.g. E001' },
        { key: 'WordId', label: 'Word ID', placeholder: 'Parent Word ID' },
        { key: 'DataType', label: 'Data Type', placeholder: 'e.g. BNR, BCD, DIS' },
        { key: 'Scale', label: 'Scale Factor', placeholder: 'e.g. 180/2^15' },
        { key: 'Units', label: 'Units', placeholder: 'e.g. degrees' },
        { key: 'Description', label: 'Description', placeholder: 'Element description...', rows: 2 },
      ]}
    />
  );
}
