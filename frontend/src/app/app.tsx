import { useRef, useState } from 'react';
import { ViewToggleButton } from '../components/shared/ViewToggleButton/ViewToggleButton';
import { UserModal } from '../components/UserModal/UserModal';
import { UserList } from '../components/UserList/UserList';
import { UserGridView } from '../components/UserGridView/UserGridView';
import { UserImageModal } from '../components/UserImageModal/UserImageModal';
import { Loading } from '../components/shared/Loading/Loading';
import { ErrorMessage } from '../components/shared/ErrorMessage/ErrorMessage';
import { useUser } from '../hooks/useUser';
import { User } from '@shared-types';
import { UserSearchBar } from '../components/SearchBar/UserSearchBar';
import { usePaginatedQueryParam } from '../hooks/usePaginatedQueryParam';

const App = () => {
  const [view, setView] = useState<'list' | 'grid'>(() => {
    const saved = localStorage.getItem('view');
    return saved === 'grid' ? 'grid' : 'list';
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const prevQueryRef = useRef('');
  const [page, setPage] = usePaginatedQueryParam();

  const {
    users,
    isLoading,
    isError,
    totalPages,
    deleteUser: deleteUserById,
  } = useUser(page, searchQuery);

  const handleViewChange = (newView: 'list' | 'grid') => {
    setView(newView);
    localStorage.setItem('view', newView);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query !== prevQueryRef.current) {
      setPage(1);
      prevQueryRef.current = query;
    }
  };

  return (
    <main
      role="main"
      className="min-h-screen bg-white text-gray-900 p-4 sm:p-6 md:p-8"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* View Toggle */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-6"
          role="group"
          aria-label="Toggle view controls"
        >
          <ViewToggleButton
            onClick={() => handleViewChange('list')}
            selected={view === 'list'}
            aria-pressed={view === 'list'}
          >
            List view
          </ViewToggleButton>

          <ViewToggleButton
            onClick={() => handleViewChange('grid')}
            selected={view === 'grid'}
            aria-pressed={view === 'grid'}
          >
            Grid view
          </ViewToggleButton>

          <ViewToggleButton onClick={() => setModalOpen(true)}>
            Create user
          </ViewToggleButton>
        </div>

        {/* Search */}
        <UserSearchBar onSearch={handleSearch} />

        {/* Status feedback */}
        {isLoading && <Loading />}
        {isError && <ErrorMessage message="Failed to load users." />}

        {/* Views */}
        {!isLoading &&
          !isError &&
          (view === 'list' ? (
            <UserList
              users={users}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
              deleteUserById={deleteUserById}
            />
          ) : (
            <UserGridView
              users={users}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onImageClick={setPreviewUser}
              isLoading={isLoading}
            />
          ))}

        {/* Modals */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          user={null}
        />

        {previewUser && (
          <UserImageModal
            imageUrl={previewUser.imageUrl}
            userName={`${previewUser.firstName} ${previewUser.lastName}`}
            onClose={() => setPreviewUser(null)}
          />
        )}
      </div>
    </main>
  );
};

export default App;
