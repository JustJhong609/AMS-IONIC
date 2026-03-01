import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButtons,
  IonBackButton, IonSearchbar, IonFab, IonFabButton, IonIcon,
  IonCard, IonCardContent, IonAvatar, IonText, IonAlert,
  IonButton,
} from '@ionic/react';
import { add, pencilOutline, trashOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Learner } from '../types';
import { DISTRICT } from '../utils/constants';

const LearnerListPage: React.FC = () => {
  const { learners, setLearners } = useAppContext();
  const history = useHistory();
  const [query, setQuery]         = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Learner | null>(null);

  const filtered = learners.filter(l => {
    const q = query.toLowerCase();
    return (
      l.firstName.toLowerCase().includes(q) ||
      l.lastName.toLowerCase().includes(q) ||
      l.middleName.toLowerCase().includes(q)
    );
  });

  const initials = (l: Learner) =>
    `${l.firstName.charAt(0)}${l.lastName.charAt(0)}`.toUpperCase();

  const handleDelete = (id: string) => {
    setLearners(prev => prev.filter(l => l.id !== id));
    setDeleteTarget(null);
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
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>

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
                    <div style={styles.meta} className="ion-text-nowrap"
                      dangerouslySetInnerHTML={{ __html: learner.completeAddress }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }} onClick={e => e.stopPropagation()}>
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
          { text: 'Delete', role: 'destructive', handler: () => handleDelete(deleteTarget!.id) },
        ]}
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
};

export default LearnerListPage;
