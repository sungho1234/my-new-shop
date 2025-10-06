"use client"; 

import React, { useState } from 'react';
import styles from './ProductDetail.module.css';

// 메인 페이지의 헤더와 푸터를 불러옵니다.
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductDetailPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

    return (
        // 전체 구조를 div로 감싸고 공용 헤더/푸터를 적용합니다.
        <div>
            <Header />

            <div id="wrapper"> {/* 이 부분은 globals.css에 정의된 스타일을 사용합니다. */}
                <div className={styles.mainContainer}>
                    {/* 메인 콘텐츠 */}
                    <main className={styles.contentColumn}>
                        <section className={`${styles.mediaContainer} ${styles.card}`}>
                            <video poster="/썸네일.png" src="/예제영상.mp4" loop autoPlay muted playsInline></video>
                        </section>

                        <nav className={styles.tabsNav}>
                            <button 
                                className={`${styles.tabLink} ${activeTab === 'overview' ? styles.active : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Introduction
                            </button>
                            <button 
                                className={`${styles.tabLink} ${activeTab === 'details' ? styles.active : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Detail
                            </button>
                        </nav>

                        {/* Introduction 탭 내용 */}
                        {activeTab === 'overview' && (
                            <div id="overview" className={`${styles.tabPane} ${styles.active}`}>
                                <section className={`${styles.descriptionBox} ${styles.card}`}>
                                    <h3>Description</h3>
                                    <p>
                                        <strong>체계적인 자산 관리를 위한 제안</strong><br />
                                        MAXX Quant System v4.1은 변동성 시장에 대응하기 위해 설계된 자동화된 퀀트 트레이딩 시스템입니다. 본 시스템의 핵심 목표는 트레이딩 과정에서 인간의 감정적 판단과 피로를 배제하고, 사전에 정의된 데이터 기반 전략을 24시간 일관되게 수행하는 것입니다.
                                        {!isDescriptionExpanded && <span>... </span>}
                                        {isDescriptionExpanded && <span className={styles.moreText} style={{display: 'inline'}}>이것은 시장을 예측하는 도구가 아닌, 설정된 원칙에 따라 리스크를 관리하고 기회를 포착하는 자동화된 실행 도구입니다.</span>}
                                        {!isDescriptionExpanded && <button className={styles.showMoreButton} onClick={() => setDescriptionExpanded(true)}>Show more</button>}
                                    </p>
                                </section>
                                <section className={`${styles.featuresBox} ${styles.card}`}>
                                    <h3>v4.1의 핵심 엔진</h3>
                                    <ul className={styles.featureList}>
                                        <li>
                                            <h4>N-BEATS 딥러닝 모델 (시계열 데이터 분석)</h4>
                                            <p>과거 가격, 거래량 등 복합적인 시계열 데이터를 분석하여 통계적으로 유의미한 비선형 패턴을 식별하는 데 사용됩니다.</p>
                                        </li>
                                        <li>
                                            <h4>자동 포트폴리오 리밸런싱 (리스크 관리)</h4>
                                            <p>사전에 설정된 리스크 허용 범위(예: MDD)를 준수하기 위해, 시장 상황 변화에 따라 자산 배분을 자동으로 조정합니다.</p>
                                        </li>
                                    </ul>
                                </section>
                                <section className={`${styles.trustBox} ${styles.card}`}>
                                    <h3>Trust & Principles</h3>
                                    <ul className={styles.featureList}>
                                        <li>
                                            <h4>비소유권 원칙 (Non-Custodial)</h4>
                                            <p>저희는 고객님의 자산에 절대로 접근할 수 없습니다. 시스템은 거래소 API를 통해 매매 신호만 전달할 뿐, 자금의 입출금 권한은 오직 고객님 본인에게만 있습니다.</p>
                                        </li>
                                        <li>
                                            <h4>데이터 기반 의사결정 (Data-Driven)</h4>
                                            <p>시스템의 모든 판단은 주관적인 예측이 아닌, 백테스팅으로 검증된 통계적 모델에 따라 이루어집니다.</p>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                        )}
                        
                        {/* Detail 탭 내용 */}
                        {activeTab === 'details' && (
                             <div id="details" className={`${styles.tabPane} ${styles.active}`}>
                                <section className={`${styles.guideBox} ${styles.card}`}>
                                    <h3>사용 가이드 및 기술 백서 (PDF)</h3>
                                    <p>시스템의 설치 방법부터 실전 운용 가이드, 그리고 MAXX 시스템의 핵심 전략 로직과 리스크 관리 기준이 투명하게 기술된 통합 문서입니다. 아래 링크를 통해 PDF 파일을 확인하실 수 있습니다.</p>
                                    <a href="#" className={styles.pdfDownloadButton}>User Guide & Whitepaper 다운로드</a>
                                </section>
                                <section className={`${styles.performanceDataBox} ${styles.card}`}>
                                    <h3>과거 데이터 기반의 백테스트 결과</h3>
                                    <ul className={styles.keyValueList}>
                                        <li><span>누적 수익률 (CAGR)</span><strong>+1,240%</strong></li>
                                        <li><span>최대 손실폭 (MDD)</span><strong>-12.8%</strong></li>
                                        <li><span>평균 거래 실행 속도</span><strong>0.05초</strong></li>
                                    </ul>
                                    <p className={styles.disclaimer}>주의: 과거의 성과가 미래의 수익을 보장하지 않으며, 모든 투자는 시장 변동성에 따른 위험을 내포합니다. 본 데이터는 시스템의 과거 성향을 이해하기 위한 참고 자료입니다.</p>
                                </section>
                            </div>
                        )}
                    </main>

                    {/* 사이드바 */}
                    <aside className={styles.sidebarColumn}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.collectionInfo}>
                                <img src="/로고.png" alt="MAXX Quant System logo" />
                                <a href="#">MAXX Quant System</a>
                            </div>
                    
                            <h1>MAXX Quant System v4.1</h1>
                    
                            <div className={styles.participants}>
                                <div className={styles.participantItem}>
                                    <img src="/코빠로고1.png" alt="Creator logo" />
                                    <div>
                                        <span>Creator</span>
                                        <a href="#">kobba</a>
                                    </div>
                                </div>
                                <div className={styles.participantItem}>
                                    <img src="/오너로고.png" alt="Owner logo" className={styles.avatarCircle} />
                                    <div>
                                        <span>Current owner</span>
                                        <a href="#">SUNG</a>
                                    </div>
                                </div>
                            </div>
                    
                            <div className={styles.actionBar}>
                                <button className={styles.actionBtn}>♡ 0</button>
                                <button className={styles.actionBtn}>↑ Share</button>
                                <button className={styles.actionBtn}>↻ Refresh</button>
                                <button className={styles.actionBtn}>···</button>
                            </div>
                    
                            <hr className={styles.separator} />
                    
                            <div className={`${styles.priceBox} ${styles.card}`}>
                                <div className={styles.priceInfo}>
                                    <span>Price</span>
                                    <span className={styles.price}>0.5 ETH</span>
                                    <span className={styles.priceSecondary}>$2,415</span>
                                </div>
                                <button className={styles.buyButton}>Buy now for 0.5 ETH</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailPage;