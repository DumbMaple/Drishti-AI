import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SSIPMT_BUILDINGS, BuildingInfo } from '../data/ssipmtCampusKnowledge';

interface ThreeCampusTwinProps {
  campusKey: string;
  isDark: boolean;
  onSimAlert?: (type: 'crowd' | 'fall') => void;
  highlightedBuildingId?: string;
  onSelectBuilding?: (buildingId: string) => void;
}

export function ThreeCampusTwin({
  isDark,
  highlightedBuildingId,
  onSelectBuilding,
}: ThreeCampusTwinProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const campusGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(SSIPMT_BUILDINGS.admin);

  // Reconstruct exact SSIPMT Raipur Campus based on the user's hand-drawn blueprint (image_b68541e7.png)
  const buildSSIPMTHanDrawnCampus = (dark: boolean) => {
    const campusGroup = campusGroupRef.current;
    if (!campusGroup) return;

    while (campusGroup.children.length > 0) {
      campusGroup.remove(campusGroup.children[0]);
    }

    // Colors & Materials
    const groundMat = new THREE.MeshStandardMaterial({
      color: dark ? 0x09121d : 0xecf3e4, // Fresh campus grass lawn
      roughness: 0.9,
    });
    const roadMat = new THREE.MeshStandardMaterial({
      color: dark ? 0x18202c : 0x334155, // Dark asphalt
      roughness: 0.8,
    });
    const curbMat = new THREE.MeshStandardMaterial({
      color: dark ? 0x334155 : 0xcfd8dc,
      roughness: 0.7,
    });
    const dividerMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Yellow divider strip
    const wallMat = new THREE.MeshStandardMaterial({
      color: dark ? 0x1e293b : 0xe2e8f0,
      roughness: 0.6,
    });
    const bldgMat = new THREE.MeshStandardMaterial({
      color: dark ? 0x1f293d : 0xfffef0, // Warm campus facade
      roughness: 0.4,
    });
    const adminMat = new THREE.MeshStandardMaterial({
      color: dark ? 0x24324d : 0xfef9c3, // Distinctive admin cream
      roughness: 0.35,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: dark ? 0x0f172a : 0x475569,
      roughness: 0.5,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const accentYellowMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.3,
    });
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
    });

    // 1. MAIN CAMPUS BASE GROUND
    const baseGeo = new THREE.BoxGeometry(106, 1.6, 86);
    const baseMesh = new THREE.Mesh(baseGeo, groundMat);
    baseMesh.position.y = -0.8;
    baseMesh.receiveShadow = true;
    campusGroup.add(baseMesh);

    // Boundary walls around campus
    const boundW = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 86), wallMat);
    boundW.position.set(-52.5, 0.7, 0);
    campusGroup.add(boundW);

    const boundE = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 86), wallMat);
    boundE.position.set(52.5, 0.7, 0);
    campusGroup.add(boundE);

    const boundN = new THREE.Mesh(new THREE.BoxGeometry(106, 1.4, 0.8), wallMat);
    boundN.position.set(0, 0.7, -42.5);
    campusGroup.add(boundN);

    // =========================================================================
    // 2. FRONT ROAD WITH DIVIDER & "WAY TO PLANET CITY" BRANCH (South edge)
    // =========================================================================
    // Front Highway Road (Horizontal across south)
    const frontRoad = new THREE.Mesh(new THREE.BoxGeometry(106, 0.16, 11), roadMat);
    frontRoad.position.set(0, 0.08, 32);
    campusGroup.add(frontRoad);

    // Concrete Central Divider Island with Yellow Striping
    const dividerIsland = new THREE.Mesh(new THREE.BoxGeometry(86, 0.3, 0.8), curbMat);
    dividerIsland.position.set(6, 0.15, 32);
    campusGroup.add(dividerIsland);

    // Yellow Lane Marks on Front Road
    for (let x = -36; x <= 48; x += 6) {
      const yellowDash = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.32, 0.3), dividerMat);
      yellowDash.position.set(x, 0.18, 32);
      campusGroup.add(yellowDash);
    }

    // Branch South: "Way to Planet City" road (as drawn in sketch)
    const planetCityRoad = new THREE.Mesh(new THREE.BoxGeometry(9, 0.16, 16), roadMat);
    planetCityRoad.position.set(18, 0.08, 44);
    campusGroup.add(planetCityRoad);

    // Turn branch road for Planet City
    const planetCityTurn = new THREE.Mesh(new THREE.BoxGeometry(22, 0.16, 7), roadMat);
    planetCityTurn.position.set(28, 0.08, 48);
    campusGroup.add(planetCityTurn);

    // Directional Signboard: "WAY TO PLANET CITY"
    const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3, 8), curbMat);
    signPole.position.set(23, 1.5, 37);
    campusGroup.add(signPole);

    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.4, 0.2), accentYellowMat);
    signBoard.position.set(23, 3, 37);
    campusGroup.add(signBoard);

    // =========================================================================
    // 3. MAIN GATE (Left entrance from front road into the campus)
    // =========================================================================
    const gateAvenue = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.16, 18), roadMat);
    gateAvenue.position.set(-36, 0.08, 22);
    campusGroup.add(gateAvenue);

    // Main Entrance Pillars & Arch
    const gatePillarL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5, 1.6), accentYellowMat);
    gatePillarL.position.set(-41, 2.5, 29);
    campusGroup.add(gatePillarL);

    const gatePillarR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5, 1.6), accentYellowMat);
    gatePillarR.position.set(-31, 2.5, 29);
    campusGroup.add(gatePillarR);

    const gateArch = new THREE.Mesh(new THREE.BoxGeometry(12, 1.2, 2), accentYellowMat);
    gateArch.position.set(-36, 5, 29);
    campusGroup.add(gateArch);

    // Security Gatehouse Cabin
    const guardCabin = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.8, 3.5), bldgMat);
    guardCabin.position.set(-30, 1.4, 25);
    campusGroup.add(guardCabin);

    // =========================================================================
    // 4. TEMPLE (Shri Shankaracharya Mandir) - Far Left
    // =========================================================================
    const templeGroup = new THREE.Group();
    templeGroup.position.set(-43, 0, 7);

    // Marble Base Platform with Steps
    const templeBase = new THREE.Mesh(
      new THREE.BoxGeometry(11, 1.2, 11),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    templeBase.position.y = 0.6;
    templeBase.userData = { id: 'temple' };
    templeGroup.add(templeBase);

    // Inner Sanctum (Garbhagriha)
    const sanctum = new THREE.Mesh(
      new THREE.BoxGeometry(7, 5, 7),
      new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.3 })
    );
    sanctum.position.y = 3.6;
    sanctum.userData = { id: 'temple' };
    templeGroup.add(sanctum);

    // Traditional Shikhara Tower Spire
    const shikhara = new THREE.Mesh(
      new THREE.ConeGeometry(4.2, 6.5, 4),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    );
    shikhara.rotateY(Math.PI / 4);
    shikhara.position.y = 9.2;
    shikhara.userData = { id: 'temple' };
    templeGroup.add(shikhara);

    // Golden Kalash atop Temple
    const kalash = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.7, roughness: 0.2 })
    );
    kalash.position.y = 12.8;
    kalash.userData = { id: 'temple' };
    templeGroup.add(kalash);

    // Temple Courtyard Trees
    for (let t = 0; t < 4; t++) {
      const angle = (t * Math.PI) / 2;
      const tx = Math.cos(angle) * 7.5;
      const tz = Math.sin(angle) * 7.5;
      const tree = new THREE.Mesh(
        new THREE.SphereGeometry(1.4, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 })
      );
      tree.position.set(tx, 2.5, tz);
      templeGroup.add(tree);
    }
    campusGroup.add(templeGroup);

    // =========================================================================
    // 5. INTERNAL CAMPUS MAIN AVENUE (Connects Gate across front of linear blocks)
    // =========================================================================
    const internalAvenue = new THREE.Mesh(new THREE.BoxGeometry(82, 0.16, 7), roadMat);
    internalAvenue.position.set(2, 0.08, 13);
    campusGroup.add(internalAvenue);

    // Road connecting Gate to Internal Avenue
    const gateConnector = new THREE.Mesh(new THREE.BoxGeometry(7, 0.16, 12), roadMat);
    gateConnector.position.set(-36, 0.08, 16);
    campusGroup.add(gateConnector);

    // =========================================================================
    // 6. BACK ROAD (Runs behind the main blocks as per sketch)
    // =========================================================================
    const backRoad = new THREE.Mesh(new THREE.BoxGeometry(82, 0.16, 6), roadMat);
    backRoad.position.set(2, 0.08, -13);
    campusGroup.add(backRoad);

    // Connectors from front avenue to back road on the left
    const westPassage = new THREE.Mesh(new THREE.BoxGeometry(5, 0.16, 26), roadMat);
    westPassage.position.set(-35, 0.08, 0);
    campusGroup.add(westPassage);

    // =========================================================================
    // 7. LINEAR ROW OF MAIN BLOCKS (LEFT TO RIGHT AS DRAWN):
    //    Basketball Court -> Boys Hostel -> Management Block -> Admin Block -> Academic Block
    // =========================================================================

    // BLOCK A: BASKETBALL COURT (Large open court)
    const courtGroup = new THREE.Group();
    courtGroup.position.set(-27, 0, 0);

    // Basketball Hardcourt Surface
    const courtFloor = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.22, 14),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })
    );
    courtFloor.position.y = 0.11;
    courtFloor.userData = { id: 'basketball_court' };
    courtGroup.add(courtFloor);

    // Inner Court Key Area
    const courtKey = new THREE.Mesh(
      new THREE.BoxGeometry(9.4, 0.24, 12.4),
      new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.6 })
    );
    courtKey.position.y = 0.12;
    courtKey.userData = { id: 'basketball_court' };
    courtGroup.add(courtKey);

    // Hoops on both ends
    for (const zOffset of [-6, 6]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8, 8), curbMat);
      pole.position.set(0, 1.9, zOffset);
      courtGroup.add(pole);

      const backboard = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 0.1), wallMat);
      backboard.position.set(0, 3.5, zOffset);
      courtGroup.add(backboard);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 16), redMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(0, 3.1, zOffset + (zOffset < 0 ? 0.45 : -0.45));
      courtGroup.add(rim);
    }
    campusGroup.add(courtGroup);

    // BLOCK B: BOYS HOSTEL (Multi-storey residential)
    const boysHostelGroup = new THREE.Group();
    boysHostelGroup.position.set(-15, 0, 0);

    const bHostelMesh = new THREE.Mesh(new THREE.BoxGeometry(9, 11, 14), bldgMat);
    bHostelMesh.position.y = 5.5;
    bHostelMesh.userData = { id: 'boys_hostel' };
    bHostelMesh.castShadow = true;
    boysHostelGroup.add(bHostelMesh);

    const bHostelRoof = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.8, 14.6), roofMat);
    bHostelRoof.position.y = 11.4;
    bHostelRoof.userData = { id: 'boys_hostel' };
    boysHostelGroup.add(bHostelRoof);

    // Window bands
    for (let floor = 1; floor <= 3; floor++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.2, 14.2), glassMat);
      win.position.y = floor * 2.8;
      boysHostelGroup.add(win);
    }
    campusGroup.add(boysHostelGroup);

    // BLOCK C: MANAGEMENT BLOCK (MBA & First Year)
    const mgtGroup = new THREE.Group();
    mgtGroup.position.set(-3, 0, 0);

    const mgtMesh = new THREE.Mesh(new THREE.BoxGeometry(9.5, 9.5, 14), bldgMat);
    mgtMesh.position.y = 4.75;
    mgtMesh.userData = { id: 'management_block' };
    mgtMesh.castShadow = true;
    mgtGroup.add(mgtMesh);

    // Distinctive Yellow Sunshade Fascia
    const mgtFascia = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.9, 14.6), accentYellowMat);
    mgtFascia.position.y = 9.8;
    mgtFascia.userData = { id: 'management_block' };
    mgtGroup.add(mgtFascia);

    for (let f = 1; f <= 3; f++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(8, 1.1, 14.2), glassMat);
      win.position.y = f * 2.6;
      mgtGroup.add(win);
    }
    campusGroup.add(mgtGroup);

    // BLOCK D: ADMIN BLOCK (Central Administrative Headquarters)
    const adminGroup = new THREE.Group();
    adminGroup.position.set(9, 0, 0);

    const adminMesh = new THREE.Mesh(new THREE.BoxGeometry(10.5, 11.5, 15), adminMat);
    adminMesh.position.y = 5.75;
    adminMesh.userData = { id: 'admin' };
    adminMesh.castShadow = true;
    adminGroup.add(adminMesh);

    // Grand Entrance Portico
    const adminPortico = new THREE.Mesh(new THREE.BoxGeometry(7, 9, 3.5), accentYellowMat);
    adminPortico.position.set(0, 4.5, 8.5);
    adminPortico.userData = { id: 'admin' };
    adminGroup.add(adminPortico);

    // Pediment Roof
    const pedimentGeo = new THREE.ConeGeometry(5.2, 2.4, 4);
    pedimentGeo.rotateY(Math.PI / 4);
    const pediment = new THREE.Mesh(pedimentGeo, roofMat);
    pediment.position.set(0, 10.2, 8.5);
    pediment.userData = { id: 'admin' };
    adminGroup.add(pediment);

    // Admin Glass Portal
    const adminGlass = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.5, 0.3), glassMat);
    adminGlass.position.set(0, 2.25, 10.3);
    adminGroup.add(adminGlass);

    // Central Flagpole with Indian Tricolor
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6, 8), curbMat);
    flagPole.position.set(0, 14.5, 0);
    adminGroup.add(flagPole);

    const flagMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xf97316 })
    );
    flagMesh.position.set(0.8, 16.5, 0);
    adminGroup.add(flagMesh);

    campusGroup.add(adminGroup);

    // BLOCK E: ACADEMIC BLOCK (Engineering Departments)
    const acadGroup = new THREE.Group();
    acadGroup.position.set(21, 0, 0);

    const acadMesh = new THREE.Mesh(new THREE.BoxGeometry(10.5, 12.5, 15), bldgMat);
    acadMesh.position.y = 6.25;
    acadMesh.userData = { id: 'academic_block' };
    acadMesh.castShadow = true;
    acadGroup.add(acadMesh);

    const acadRoof = new THREE.Mesh(new THREE.BoxGeometry(11, 0.8, 15.6), roofMat);
    acadRoof.position.y = 12.8;
    acadRoof.userData = { id: 'academic_block' };
    acadGroup.add(acadRoof);

    // Academic Window Ribbons
    for (let f = 1; f <= 4; f++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(8.8, 1.2, 15.2), glassMat);
      win.position.y = f * 2.7;
      acadGroup.add(win);
    }
    campusGroup.add(acadGroup);

    // =========================================================================
    // 8. MEDICAL ROOM & HEALTH DISPENSARY (On Back Road behind Academic/Admin)
    // =========================================================================
    const medGroup = new THREE.Group();
    medGroup.position.set(15, 0, -21);

    const medMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4.5, 7),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    medMesh.position.y = 2.25;
    medMesh.userData = { id: 'medical' };
    medGroup.add(medMesh);

    const medRoof = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.6, 7.6), roofMat);
    medRoof.position.y = 4.8;
    medRoof.userData = { id: 'medical' };
    medGroup.add(medRoof);

    // Red Cross Sign on front
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.1), redMat);
    crossV.position.set(0, 2.6, 3.55);
    medGroup.add(crossV);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.1), redMat);
    crossH.position.set(0, 2.6, 3.55);
    medGroup.add(crossH);

    // Campus Ambulance
    const ambulance = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.6, 3.6),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    ambulance.position.set(5.5, 0.8, 0);
    medGroup.add(ambulance);

    const ambLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.2, 0.6),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    ambLight.position.set(5.5, 1.7, 0);
    medGroup.add(ambLight);

    campusGroup.add(medGroup);

    // =========================================================================
    // 9. TRANSVERSE MAIN ROAD & PARKING AREA (Between Academic & New Building)
    // =========================================================================
    // Transverse road connecting front avenue, back road, and canteen
    const parkingAvenue = new THREE.Mesh(new THREE.BoxGeometry(7, 0.16, 40), roadMat);
    parkingAvenue.position.set(29, 0.08, -3);
    campusGroup.add(parkingAvenue);

    // Parking Bays with slanted carport covers along both sides of road
    const parkingGroup = new THREE.Group();
    parkingGroup.position.set(29, 0, 0);

    const carportL = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
    );
    carportL.position.set(-4.5, 2.8, 0);
    carportL.userData = { id: 'parking' };
    parkingGroup.add(carportL);

    const carportR = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
    );
    carportR.position.set(4.5, 2.8, 0);
    carportR.userData = { id: 'parking' };
    parkingGroup.add(carportR);

    // Realistic miniature cars in parking
    const carColors = [0xef4444, 0xfacc15, 0xffffff, 0x10b981, 0x3b82f6];
    for (let i = 0; i < 4; i++) {
      const car = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.1, 2.8),
        new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length] })
      );
      car.position.set(-4.5, 0.6, -5 + i * 3.4);
      parkingGroup.add(car);
    }
    for (let i = 0; i < 3; i++) {
      const car = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.1, 2.8),
        new THREE.MeshStandardMaterial({ color: carColors[(i + 2) % carColors.length] })
      );
      car.position.set(4.5, 0.6, -4 + i * 3.6);
      parkingGroup.add(car);
    }
    campusGroup.add(parkingGroup);

    // =========================================================================
    // 10. CANTEEN (Campus Cafeteria - Located North of Parking)
    // =========================================================================
    const canteenGroup = new THREE.Group();
    canteenGroup.position.set(29, 0, -25);

    const canteenMesh = new THREE.Mesh(new THREE.BoxGeometry(9.5, 4.5, 8.5), accentYellowMat);
    canteenMesh.position.y = 2.25;
    canteenMesh.userData = { id: 'canteen' };
    canteenGroup.add(canteenMesh);

    // Pavilion Roof
    const canteenRoof = new THREE.Mesh(
      new THREE.ConeGeometry(7, 2.8, 4),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    canteenRoof.rotateY(Math.PI / 4);
    canteenRoof.position.y = 5.8;
    canteenRoof.userData = { id: 'canteen' };
    canteenGroup.add(canteenRoof);

    // Outdoor seating tables with umbrellas
    for (let u = 0; u < 3; u++) {
      const umbrella = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 0.6, 8),
        new THREE.MeshStandardMaterial({ color: 0xfacc15 })
      );
      umbrella.position.set(-5 + u * 4, 2.1, 6);
      canteenGroup.add(umbrella);

      const uPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2, 8), curbMat);
      uPole.position.set(-5 + u * 4, 1, 6);
      canteenGroup.add(uPole);
    }
    campusGroup.add(canteenGroup);

    // =========================================================================
    // 11. NEW BUILDING (AICTE IDEA Lab & Tech Extension) - Right Flank
    // =========================================================================
    const newBldgGroup = new THREE.Group();
    newBldgGroup.position.set(40, 0, 0);

    const newBldgMesh = new THREE.Mesh(new THREE.BoxGeometry(11.5, 13, 16), bldgMat);
    newBldgMesh.position.y = 6.5;
    newBldgMesh.userData = { id: 'new_building' };
    newBldgMesh.castShadow = true;
    newBldgGroup.add(newBldgMesh);

    // Large Glass Modern Atrium (AICTE IDEA Lab)
    const ideaLabGlass = new THREE.Mesh(new THREE.BoxGeometry(7, 6, 3), glassMat);
    ideaLabGlass.position.set(0, 3, 9);
    ideaLabGlass.userData = { id: 'new_building' };
    newBldgGroup.add(ideaLabGlass);

    const newBldgRoof = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 16.6), roofMat);
    newBldgRoof.position.y = 13.4;
    newBldgRoof.userData = { id: 'new_building' };
    newBldgGroup.add(newBldgRoof);

    // Rooftop solar array
    for (let s = -3; s <= 3; s += 2.5) {
      const solar = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.1, 12),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.6, roughness: 0.2 })
      );
      solar.position.set(s, 14, 0);
      newBldgGroup.add(solar);
    }
    campusGroup.add(newBldgGroup);

    // =========================================================================
    // 12. GIRLS HOSTEL (Top Right Corner as per Sketch)
    // =========================================================================
    const girlsHostelGroup = new THREE.Group();
    girlsHostelGroup.position.set(42, 0, -22);

    const gHostelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 12),
      new THREE.MeshStandardMaterial({ color: dark ? 0x3b2d4a : 0xfdf2f8, roughness: 0.35 })
    );
    gHostelMesh.position.y = 5;
    gHostelMesh.userData = { id: 'girls_hostel' };
    gHostelMesh.castShadow = true;
    girlsHostelGroup.add(gHostelMesh);

    const gHostelRoof = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.8, 12.6), roofMat);
    gHostelRoof.position.y = 10.4;
    gHostelRoof.userData = { id: 'girls_hostel' };
    girlsHostelGroup.add(gHostelRoof);

    // Private Garden Lawn for Girls Hostel
    const gLawn = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.18, 6),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 })
    );
    gLawn.position.set(0, 0.09, 8);
    girlsHostelGroup.add(gLawn);

    campusGroup.add(girlsHostelGroup);

    // =========================================================================
    // 13. CAMPUS TREES & GREENERY (Along Roads & Perimeter)
    // =========================================================================
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 });

    const treeLocations = [
      { x: -38, z: 5 },
      { x: -38, z: -5 },
      { x: -35, z: 20 },
      { x: -27, z: 17 },
      { x: -15, z: 17 },
      { x: -3, z: 17 },
      { x: 9, z: 17 },
      { x: 21, z: 17 },
      { x: 33, z: 17 },
      { x: -27, z: -17 },
      { x: -15, z: -17 },
      { x: -3, z: -17 },
      { x: 9, z: -17 },
      { x: 48, z: 10 },
      { x: 48, z: -5 },
      { x: 48, z: -20 },
    ];

    treeLocations.forEach((tp) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2, 8), treeTrunkMat);
      trunk.position.set(tp.x, 1, tp.z);
      campusGroup.add(trunk);

      const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), foliageMat);
      leaves.position.set(tp.x, 2.7, tp.z);
      campusGroup.add(leaves);
    });

    // =========================================================================
    // 14. ACTIVE SURVEILLANCE BEACONS (For real-time telemetry inspection)
    // =========================================================================
    const beacons = [
      { x: -43, y: 14, z: 7, color: 0x10b981, id: 'temple' },
      { x: -27, y: 4, z: 0, color: 0x10b981, id: 'basketball_court' },
      { x: -15, y: 12.5, z: 0, color: 0x10b981, id: 'boys_hostel' },
      { x: -3, y: 11, z: 0, color: 0x10b981, id: 'management_block' },
      { x: 9, y: 13, z: 0, color: 0x10b981, id: 'admin' },
      { x: 21, y: 14, z: 0, color: 0xf59e0b, id: 'academic_block' },
      { x: 15, y: 5.5, z: -21, color: 0x10b981, id: 'medical' },
      { x: 29, y: 4, z: 0, color: 0xef4444, id: 'parking' },
      { x: 29, y: 7, z: -25, color: 0xf59e0b, id: 'canteen' },
      { x: 40, y: 14.5, z: 0, color: 0x10b981, id: 'new_building' },
      { x: 42, y: 11.5, z: -22, color: 0x10b981, id: 'girls_hostel' },
    ];

    beacons.forEach((b) => {
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: b.color })
      );
      pin.position.set(b.x, b.y, b.z);
      pin.userData = { id: b.id };
      campusGroup.add(pin);
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isDark ? 0x060913 : 0xfffef5);

    const aspect = container.clientWidth / container.clientHeight;
    const d = 46;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    // Isometric angle showcasing the front road, main gate, linear blocks, and back road
    camera.position.set(55, 58, 62);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm natural sun lighting
    const ambLight = new THREE.AmbientLight(0xffffff, isDark ? 0.75 : 1.2);
    scene.add(ambLight);

    const sun = new THREE.DirectionalLight(0xfff7ed, isDark ? 1.0 : 1.4);
    sun.position.set(60, 90, 45);
    sun.castShadow = true;
    scene.add(sun);

    const campusGroup = new THREE.Group();
    campusGroupRef.current = campusGroup;
    scene.add(campusGroup);

    buildSSIPMTHanDrawnCampus(isDark);

    // Raycaster for clicking & inspecting buildings
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const checkIntersection = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
      pointer.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(campusGroup.children, true);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          const bId = hit.object.userData?.id;
          if (bId && SSIPMT_BUILDINGS[bId]) {
            const b = SSIPMT_BUILDINGS[bId];
            setSelectedBuilding(b);
            if (onSelectBuilding) onSelectBuilding(bId);
            return true;
          }
        }
      }
      return false;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      checkIntersection(e.clientX, e.clientY);
    };

    container.addEventListener('click', handleCanvasClick);

    // Pointer Drag Interaction (Supports BOTH mouse and mobile/tablet touch)
    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current || !campusGroupRef.current) return;
      const deltaX = clientX - prevPointerRef.current.x;
      campusGroupRef.current.rotation.y += deltaX * 0.007;
      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    // Mouse events
    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();

    // Touch events for mobile and tablet
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        checkIntersection(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
      handlePointerUp();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newAspect = container.clientWidth / container.clientHeight;
      const dist = 46;
      cameraRef.current.left = -dist * newAspect;
      cameraRef.current.right = dist * newAspect;
      cameraRef.current.top = dist;
      cameraRef.current.bottom = -dist;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    let animId: number;
    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      if (!isDraggingRef.current && campusGroupRef.current) {
        campusGroupRef.current.rotation.y += 0.0006;
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('click', handleCanvasClick);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(isDark ? 0x060913 : 0xfffef5);
    }
    buildSSIPMTHanDrawnCampus(isDark);
  }, [isDark]);

  useEffect(() => {
    if (highlightedBuildingId && SSIPMT_BUILDINGS[highlightedBuildingId]) {
      setSelectedBuilding(SSIPMT_BUILDINGS[highlightedBuildingId]);
    }
  }, [highlightedBuildingId]);

  return (
    <div className="relative w-full h-full select-none touch-pan-y">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Building Telemetry Inspector Card (Responsive on Mobile and Tablet) */}
      {selectedBuilding && (
        <div className="absolute bottom-4 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-md z-30 bg-white/95 dark:bg-darkbg-900/95 border-2 sm:border-3 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[5px_5px_0px_#000] font-mono text-xs backdrop-blur-md space-y-2.5">
          <div className="flex items-start sm:items-center justify-between gap-2 pb-2 border-b-2 border-black/15">
            <div className="min-w-0">
              <span className="text-[10px] text-amber-600 dark:text-cream-accent font-black uppercase tracking-wider block truncate">
                SSIPMT RAIPUR • {selectedBuilding.code}
              </span>
              <h4 className="text-sm sm:text-base font-black text-black dark:text-white leading-tight truncate">
                {selectedBuilding.name}
              </h4>
            </div>
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black border shrink-0 ${
                selectedBuilding.riskStatus === 'Critical'
                  ? 'bg-red-100 text-red-700 border-red-500'
                  : selectedBuilding.riskStatus === 'Moderate'
                  ? 'bg-amber-100 text-amber-700 border-amber-500'
                  : 'bg-emerald-100 text-emerald-700 border-emerald-500'
              }`}
            >
              {selectedBuilding.riskStatus.toUpperCase()}
            </span>
          </div>

          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
            {selectedBuilding.description}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Directions:</span>
            <span className="text-[10px] text-black dark:text-white font-bold bg-cream-100 dark:bg-darkbg-800 px-2 py-0.5 rounded-md border border-black/20">
              {selectedBuilding.directionsFromMainGate}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
