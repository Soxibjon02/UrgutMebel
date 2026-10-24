import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuickBuyModal } from '../components/QuickBuyModal';
import { UrbanHeroSlider } from '../components/UrbanHeroSlider';
import { UrbanTrustBadges } from '../components/UrbanTrustBadges';
import { UrbanShopTheLook } from '../components/UrbanShopTheLook';

// Urban Ladder Design Template Components
import { UrbanCategoryQuickPills } from '../components/urban/UrbanCategoryQuickPills';
import { UrbanBankOffersBar } from '../components/urban/UrbanBankOffersBar';
import { UrbanAtmosHero } from '../components/urban/UrbanAtmosHero';
import { UrbanProductRow } from '../components/urban/UrbanProductRow';
import { UrbanNewArrivalsTiles } from '../components/urban/UrbanNewArrivalsTiles';
import { UrbanDealZone } from '../components/urban/UrbanDealZone';
import { UrbanTopCategoriesCurated } from '../components/urban/UrbanTopCategoriesCurated';
import { UrbanVideoReels } from '../components/urban/UrbanVideoReels';
import { UrbanCelebrationsBanner } from '../components/urban/UrbanCelebrationsBanner';
import {
  UrbanFullBedroomBanner,
  UrbanPartnerBrandsBanner,
  UrbanStudyTablesFeature,
  UrbanGiftCardBanner,
  UrbanToledoCollectionBanner,
  UrbanExploreStoresBanner,
  UrbanNonStorageBedsBanner,
  UrbanModularKitchenBanner,
  UrbanShoeRacksBanner,
  UrbanMattressesBanner,
  UrbanSofaBedsBanner
} from '../components/urban/UrbanSectionBanners';
import { UrbanDecorCornerGrid } from '../components/urban/UrbanDecorCornerGrid';
import { UrbanNearestStoreBar } from '../components/urban/UrbanNearestStoreBar';

// Authentic Furniture Data
import {
  urbanShoeRacks,
  urbanLoungeChairs,
  urbanHydraulicBeds,
  urbanPartnerBrands,
  urbanSolidWoodBrands,
  urbanCoffeeTables,
  urbanTvUnits,
  urbanCTables,
  urbanWardrobes,
  urbanChestOfDrawers,
  urbanBookshelves,
  urbanSideboards,
  urbanRecliners,
  urbanStudyTables
} from '../data/urbanProductsData';

import { dataService, DEFAULT_HOME_SECTIONS, getStored } from '../services/dataService';

export const Home = () => {
  const [searchParams] = useSearchParams();
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [sections, setSections] = useState(() => getStored('home_sections', DEFAULT_HOME_SECTIONS));

  // Auto-scroll to section if URL has ?section=id or #id
  useEffect(() => {
    const targetSection = searchParams.get('section') || window.location.hash.replace('#', '');
    if (targetSection) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('section-highlight-pulse');
          setTimeout(() => el.classList.remove('section-highlight-pulse'), 2500);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [searchParams, sections]);

  const handleOpenQuickBuy = (product) => {
    setQuickBuyProduct(product);
    setIsQuickBuyOpen(true);
  };

  useEffect(() => {
    const loadSections = async () => {
      try {
        const secList = await dataService.getHomeSections();
        if (secList && secList.length > 0) {
          setSections(secList);
        }
      } catch (e) {
        console.warn('Error loading dynamic home sections:', e);
      }
    };

    loadSections();

    // Live update when Super Admin modifies sections layout in AdminDashboard
    const handleSectionsUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setSections(e.detail);
      } else {
        loadSections();
      }
    };

    window.addEventListener('urgut_store_home_sections_updated', handleSectionsUpdate);
    return () => {
      window.removeEventListener('urgut_store_home_sections_updated', handleSectionsUpdate);
    };
  }, []);

  // Filter only active sections and sort by order
  const sortedActiveSections = [...sections]
    .filter((s) => s.is_active !== false)
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

  // Render dynamic section based on Super Admin configured ID and props
  const renderSection = (sec) => {
    switch (sec.id) {
      case 'category_pills':
        return <UrbanCategoryQuickPills key={sec.id} title={sec.title} />;
      case 'hero_slider':
        return <UrbanHeroSlider key={sec.id} />;
      case 'bank_offers':
        return <UrbanBankOffersBar key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'atmos_hero':
        return <UrbanAtmosHero key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'shoe_racks':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Shoe Racks"}
            viewAllLink={sec.link || "/furniture?category=cat-wardrobe"}
            products={urbanShoeRacks}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'new_arrivals':
        return <UrbanNewArrivalsTiles key={sec.id} title={sec.title} badge={sec.badge} />;
      case 'deal_zone':
        return <UrbanDealZone key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'top_categories':
        return <UrbanTopCategoriesCurated key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'video_reels':
        return <UrbanVideoReels key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'celebrations_banner':
        return (
          <UrbanCelebrationsBanner
            key={sec.id}
            title={sec.title}
            subtitle={sec.subtitle}
            badge={sec.badge}
            imageUrl={sec.banner_image}
          />
        );
      case 'lounge_chairs':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Lounge Chairs"}
            viewAllLink={sec.link || "/furniture?category=cat-living"}
            products={urbanLoungeChairs}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'bedroom_banner':
        return <UrbanFullBedroomBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'hydraulic_beds':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Hydraulic Beds"}
            viewAllLink={sec.link || "/furniture?category=cat-bedroom"}
            products={urbanHydraulicBeds}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'partner_brands_banner':
        return <UrbanPartnerBrandsBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'partner_brands_products':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Top Picks From Partner Brands"}
            viewAllLink={sec.link || "/furniture"}
            products={urbanPartnerBrands}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'solid_wood_products':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Premium Solid Wood From Partner's Brand"}
            viewAllLink={sec.link || "/furniture"}
            products={urbanSolidWoodBrands}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'shop_the_look':
        return <UrbanShopTheLook key={sec.id} title={sec.title} subtitle={sec.subtitle} onQuickBuy={handleOpenQuickBuy} />;
      case 'coffee_tables':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Coffee Tables"}
            viewAllLink={sec.link || "/furniture?category=cat-living"}
            products={urbanCoffeeTables}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'tv_units':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore TV Units"}
            viewAllLink={sec.link || "/furniture?category=cat-living"}
            products={urbanTvUnits}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'study_tables_feature':
        return <UrbanStudyTablesFeature key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'c_tables':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Drink & C Tables"}
            viewAllLink={sec.link || "/furniture?category=cat-living"}
            products={urbanCTables}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'gift_card':
        return <UrbanGiftCardBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'toledo_collection':
        return <UrbanToledoCollectionBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'explore_stores':
        return <UrbanExploreStoresBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'non_storage_beds':
        return <UrbanNonStorageBedsBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'wardrobes':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Wardrobes"}
            viewAllLink={sec.link || "/furniture?category=cat-wardrobe"}
            products={urbanWardrobes}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'chest_of_drawers':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Chest Of Drawers"}
            viewAllLink={sec.link || "/furniture?category=cat-bedroom"}
            products={urbanChestOfDrawers}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'modular_kitchen':
        return <UrbanModularKitchenBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} badge={sec.badge} />;
      case 'shoe_racks_banner':
        return <UrbanShoeRacksBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'bookshelves':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Bookshelves"}
            viewAllLink={sec.link || "/furniture?category=cat-office"}
            products={urbanBookshelves}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'sideboards':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Sideboards"}
            viewAllLink={sec.link || "/furniture?category=cat-dining"}
            products={urbanSideboards}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'mattresses':
        return <UrbanMattressesBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'sofa_beds':
        return <UrbanSofaBedsBanner key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'recliners':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Recliners"}
            viewAllLink={sec.link || "/furniture?category=cat-living"}
            products={urbanRecliners}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'study_tables':
        return (
          <UrbanProductRow
            key={sec.id}
            title={sec.title || "Explore Study Tables"}
            viewAllLink={sec.link || "/furniture?category=cat-office"}
            products={urbanStudyTables}
            onQuickBuy={handleOpenQuickBuy}
          />
        );
      case 'decor_corner':
        return <UrbanDecorCornerGrid key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      case 'trust_badges':
        return <UrbanTrustBadges key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh' }}>
      
      {/* Dynamic Sections Rendered Exactly According to Super Admin Order & Visibility */}
      {sortedActiveSections.map((sec) => (
        <div
          key={sec.id}
          id={sec.id}
          className="home-section-anchor"
          style={{ scrollMarginTop: '110px' }}
        >
          {renderSection(sec)}
        </div>
      ))}

      {/* Mobile Floating Nearest Store Bar */}
      <UrbanNearestStoreBar />

      {/* 1-Click Quick Buy Modal */}
      <QuickBuyModal
        product={quickBuyProduct}
        isOpen={isQuickBuyOpen}
        onClose={() => {
          setIsQuickBuyOpen(false);
          setQuickBuyProduct(null);
        }}
      />
    </div>
  );
};

export default Home;
