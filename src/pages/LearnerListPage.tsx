import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButtons,
  IonBackButton, IonSearchbar, IonFab, IonFabButton, IonIcon,
  IonCard, IonCardContent, IonAvatar, IonText, IonAlert,
  IonButton, IonLoading, IonRefresher, IonRefresherContent,
  IonChip, IonLabel,
} from '@ionic/react';
import { add, pencilOutline, trashOutline, personOutline, filterOutline, closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Learner } from '../types';
import { DISTRICT, BARANGAY_OPTIONS } from '../utils/constants';
import { deleteLearner, fetchLearners } from '../utils/learnerApi';

const LearnerListPage: React.FC = () => {
  const { learners, user, setLearners } = useAppContext();
  const history = useHistory();
  const [query, setQuery]         = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSex, setFilterSex] = useState<string>('');
  const [filterEducation, setFilterEducation] = useState<string>('');
  const [filterBarangay, setFilterBarangay] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<Learner | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = learners.filter(l => {
    const q = query.toLowerCase();
    
    // Text search
    const matchesText = 
      l.firstName.toLowerCase().includes(q) ||
      l.lastName.toLowerCase().includes(q) ||
      l.middleName.toLowerCase().includes(q);
    
    if (!matchesText) return false;
    
    // Sex filter
    if (filterSex && l.sex !== filterSex) return false;
    
    // Education filter
    if (filterEducation === 'Elementary' && l.lastGradeCompleted !== 'G1 – G6 (Elementary)') return false;
    if (filterEducation === 'JHS' && 
      !(l.lastGradeCompleted?.includes('1st Year HS') || 
        l.lastGradeCompleted?.includes('2nd Year HS') || 
        l.lastGradeCompleted?.includes('3rd Year HS'))) return false;
    if (filterEducation === 'BLP' && !l.isBlp) return false;
    
    // Barangay filter
    if (filterBarangay && l.barangay !== filterBarangay) return false;
    
    return true;
  });

  const activeFilterCount = [filterSex, filterEducation, filterBarangay].filter(f => f).length;
  const hasActiveFilters = activeFilterCount > 0;

  const initials = (l: Learner) =>
    `${l.firstName.charAt(0)}${l.lastName.charAt(0)}`.toUpperCase();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteLearner(id);
      setDeleteTarget(null);
    } catch (error: any) {
      setDeleteTarget(null);
      setDeleteError(error?.message || 'Failed to delete learner. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    try {
      const latestLearners = await fetchLearners();
      setLearners(latestLearners);
    } catch (error) {
      console.error('Failed to refresh learners:', error);
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 4 }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>ALS Mapper</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{DISTRICT}</div>
          </div>
          <IonButtons slot="end">
            <div style={styles.countBadge}>
              <div style={styles.countNum}>{learners.length}</div>
              <div style={styles.countLbl}>{learners.length === 1 ? 'Learner' : 'Learners'}</div>
            </div>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={query}
            onIonInput={e => setQuery(e.detail.value!)}
            placeholder="Search learners by name…"
            debounce={150}
            showCancelButton="focus"
            style={styles.searchbar}
          />
        </IonToolbar>
        
        {/* Filter Toggle Button */}
        <div style={styles.filterToggleBar}>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            style={{ '--padding-start': '8px', '--padding-end': '8px' } as any}
          >
            <IonIcon icon={filterOutline} slot="start" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </IonButton>
          {hasActiveFilters && (
            <IonButton
              fill="clear"
              size="small"
              color="medium"
              onClick={() => {
                setFilterSex('');
                setFilterEducation('');
                setFilterBarangay('');
              }}
              style={{ '--padding-start': '4px', '--padding-end': '8px' } as any}
            >
              Clear
            </IonButton>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={styles.filterPanel}>
            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Gender</div>
              <div style={styles.filterChips}>
                {['Male', 'Female'].map(sex => (
                  <IonChip
                    key={sex}
                    onClick={() => setFilterSex(filterSex === sex ? '' : sex)}
                    style={{
                      background: filterSex === sex ? 'var(--ion-color-primary)' : '#e0e0e0',
                      color: filterSex === sex ? '#fff' : '#333',
                    }}
                  >
                    <IonLabel>{sex}</IonLabel>
                  </IonChip>
                ))}
              </div>
            </div>

            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Education Level</div>
              <div style={styles.filterChips}>
                {['Elementary', 'JHS', 'BLP'].map(edu => (
                  <IonChip
                    key={edu}
                    onClick={() => setFilterEducation(filterEducation === edu ? '' : edu)}
                    style={{
                      background: filterEducation === edu ? 'var(--ion-color-primary)' : '#e0e0e0',
                      color: filterEducation === edu ? '#fff' : '#333',
                    }}
                  >
                    <IonLabel>{edu}</IonLabel>
                  </IonChip>
                ))}
              </div>
            </div>

            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Barangay</div>
              <div style={styles.filterChips}>
                {BARANGAY_OPTIONS.map(brgy => (
                  <IonChip
                    key={brgy}
                    onClick={() => setFilterBarangay(filterBarangay === brgy ? '' : brgy)}
                    style={{
                      background: filterBarangay === brgy ? 'var(--ion-color-primary)' : '#e0e0e0',
                      color: filterBarangay === brgy ? '#fff' : '#333',
                    }}
                  >
                    <IonLabel>{brgy}</IonLabel>
                  </IonChip>
                ))}
              </div>
            </div>
          </div>
        )}
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingText="Pull to refresh"
            refreshingSpinner="crescent"
            refreshingText="Refreshing learners..."
          />
        </IonRefresher>

        {filtered.length === 0 ? (
          <EmptyState hasLearners={learners.length > 0} onAdd={() => history.push('/learners/new')} />
        ) : (
          filtered.map(learner => (
            <IonCard
              key={learner.id}
              button
              onClick={() => history.push(`/learners/${learner.id}`)}
              style={{ margin: '6px 16px', borderRadius: 14 }}
            >
              <IonCardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Avatar */}
                  <IonAvatar style={styles.avatar}>
                    <div style={styles.avatarInner}>
                      {initials(learner)}
                    </div>
                  </IonAvatar>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.name}>
                      {learner.lastName}, {learner.firstName} {learner.middleName}
                    </div>
                    <div style={styles.meta}>
                      Age: {learner.age} &nbsp;|&nbsp; {learner.sex}
                    </div>
                    <div style={styles.meta} className="ion-text-nowrap">
                      Mapped by: {learner.mappedBy}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }} onClick={e => e.stopPropagation()}>
                    {user?.id === learner.createdBy && (
                      <>
                        <IonButton
                          fill="clear"
                          size="small"
                          color="primary"
                          onClick={() => history.push(`/learners/edit/${learner.id}`)}
                        >
                          <IonIcon slot="icon-only" icon={pencilOutline} />
                        </IonButton>
                        <IonButton
                          fill="clear"
                          size="small"
                          color="danger"
                          onClick={() => setDeleteTarget(learner)}
                        >
                          <IonIcon slot="icon-only" icon={trashOutline} />
                        </IonButton>
                      </>
                    )}
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        )}

        <div style={{ height: 80 }} />

        {/* FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/learners/new')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      {/* Delete confirm */}
      <IonAlert
        isOpen={!!deleteTarget}
        onDidDismiss={() => setDeleteTarget(null)}
        header="Delete Learner"
        message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This cannot be undone.`}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', role: 'destructive', handler: () => { void handleDelete(deleteTarget!.id); } },
        ]}
      />

      <IonAlert
        isOpen={!!deleteError}
        onDidDismiss={() => setDeleteError('')}
        header="Delete Failed"
        message={deleteError}
        buttons={['OK']}
      />

      <IonLoading
        isOpen={isDeleting}
        message="Deleting learner..."
        spinner="crescent"
      />
    </IonPage>
  );
};

/* ── Empty State ─────────────────────────────────────────────────────────────── */
const EmptyState: React.FC<{ hasLearners: boolean; onAdd: () => void }> = ({ hasLearners, onAdd }) => (
  <div style={{ textAlign: 'center', padding: '60px 32px' }}>
    <div style={{
      width: 88, height: 88, borderRadius: '50%',
      background: '#E3F2FD', display: 'flex',
      alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
    }}>
      <IonIcon icon={personOutline} style={{ fontSize: 44, color: 'var(--ion-color-primary)' }} />
    </div>
    <IonText>
      <h2 style={{ fontWeight: 800, margin: '0 0 8px' }}>
        {hasLearners ? 'No Results Found' : 'Welcome to ALS Mapper!'}
      </h2>
      <p style={{ color: '#757575', lineHeight: '1.6' }}>
        {hasLearners
          ? 'Try searching with a different name.'
          : 'Start mapping learners in your community.'}
      </p>
    </IonText>
    {!hasLearners && (
      <IonButton style={{ marginTop: 20 }} onClick={onAdd}>
        <IonIcon slot="start" icon={add} />
        Add First Learner
      </IonButton>
    )}
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  countBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    padding: '4px 12px',
    marginRight: 8,
  },
  countNum: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 18,
    lineHeight: '1',
  },
  countLbl: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  avatar: {
    width: 48,
    height: 48,
    flexShrink: 0,
  },
  avatarInner: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'var(--ion-color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
  },
  name: {
    fontWeight: 700,
    fontSize: 15,
    color: '#212121',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  searchbar: {
    '--background': '#f5f5f5',
    '--border-radius': '24px',
    '--padding-start': '16px',
    '--padding-end': '16px',
    '--box-shadow': 'none',
  } as React.CSSProperties,
  filterToggleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderBottom: '1px solid #e0e0e0',
  },
  filterPanel: {
    padding: '12px 16px',
    background: '#fafafa',
    borderBottom: '1px solid #e0e0e0',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  filterChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
};

export default LearnerListPage;
