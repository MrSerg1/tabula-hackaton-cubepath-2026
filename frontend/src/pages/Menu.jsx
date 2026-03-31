import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Menu.module.css';
import { MenuHeader } from '../components/MenuHeader';
import { MenuCatalog } from '../components/MenuCatalog';
import { Pagination } from '../components/Pagination';
import { Footer } from '../components/Footer';

export function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(nextPage));
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <div className={styles.pageShell}>
        <MenuHeader />
        <MenuCatalog currentPage={currentPage} onTotalPagesChange={setTotalPages} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer />
    </>
  );
}
