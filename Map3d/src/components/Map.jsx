import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, Suspense, useMemo } from "react";
import { TextureLoader } from "three";
// CORREÇÃO: Adicionando a extensão .js para resolver o erro de importação
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// IMPORTANTE: Em um ambiente real, substitua estes por URLs válidas ou use assets embutidos.
import buildingL from "../buildings/building-type-l.png";
import buildingA from "../buildings/building-type-a.png";
import buildingB from "../buildings/building-type-b.png";
import sateliteGlb from "../buildingFormats/satelliteDish_large.glb";
import buildingMGlb from "../buildingFormats/building-m.glb";
import colormap from "../buildingFormats/colormap.png";
import variantC from "../newsAssets/variation-c.png";
import variantB from "../buildingFormats/variation-b.png";
import variantA from "../buildingFormats/variation-a.png";
import texturaSpace from "../newsAssets/variation-a.png";
import plantaçãoDeVegetais from "../newsAssets/grass_large.glb";
import plantaçãoDeGrãos from "../newsAssets/grass.glb";
import pomares from "../newsAssets/tree_default.glb";
import fazendaAdm from "../newsAssets/building-type-g.glb";
import cooperativaAgricola from "../newsAssets/building-type-a.glb";
import centroComercioPlantações from "../newsAssets/building-type-t.glb";
import armazem from "../newsAssets/building-j.glb";
import silo from "../newsAssets/container-wide.glb";
import vaca from "../newsAssets/animal-bison.glb";
import galinha from "../newsAssets/ride-exit.glb";
import cercaReta from "../newsAssets/fence_simpleCenter.glb";
import cercaRedonda from "../newsAssets/fence_bendCenter.glb";
import ovelhas from "../newsAssets/building-sheep.glb";
import caminhão from "../newsAssets/truck.glb";
import arvoreCortada from "../newsAssets/tree-autumn-trunk.glb";
import arvoreCortada2 from "../newsAssets/tree-autumn-tall.glb";
import pilhaTronco from "../newsAssets/log_large.glb";
import arvoreMadeira from "../newsAssets/tree_oak_dark.glb";
import eucalipto from "../newsAssets/tree_pineTallA_detailed.glb";
import pedraGigante from "../newsAssets/rock-c.glb";
import pedraGrande from "../newsAssets/rock-b.glb";
import pedraMedia from "../newsAssets/rock-a.glb";
import variantAB from "../newsAssets/variation-ab.png";
import rocha from "../newsAssets/rocks.glb";
import pedraBaixa from "../newsAssets/road.glb";
import pa from "../newsAssets/shovel.glb";
import edStartup from "../newsAssets/building-c.glb";
import edServidor from "../newsAssets/building-d.glb";
import edDataCenter from "../newsAssets/building-skyscraper-a.glb";
import edEmpresas from "../newsAssets/building-i.glb";
import satelite from "../newsAssets/satelliteDish_detailed.glb";
import texturaEspaço from "../buildings/variation-a.png";
import hangar1 from "../newsAssets/hangar_roundA.glb";
import lab from "../newsAssets//building-d2.glb";
import galpão from "../newsAssets/building-s.glb";
import teste from "../newsAssets/corridor_windowClosed.glb";
import teste2 from "../newsAssets/hangar_largeA.glb";
import baseAutoForno from "../newsAssets/cover.glb";
import topoAutoForno from "../newsAssets/cover-hopper.glb";
import structure from "../newsAssets/structure.glb";
const DEG_TO_RAD = Math.PI / 180;
// Constante para espaçamento do grid
const LOT_SPACING = 1.2;

// ==== Configuração de edifícios ====
const BUILDING_CONFIGS = {
  // Configurações de Edifícios 1x1 existentes (simplificadas)
  L: {
    type: "texture",
    texture: buildingL,
    scale: [1, 1, 1],
    position: [0, 0.5, 0],
    hasSmoke: true,
    size: 1,
  },
  A: {
    type: "texture",
    texture: buildingA,
    scale: [1, 1, 1],
    position: [0, 0.5, 0],
    hasSmoke: true,
    size: 1,
  },
  B: {
    type: "texture",
    texture: buildingB,
    scale: [1, 1, 1],
    position: [0, 0.5, 0],
    hasSmoke: true,
    size: 1,
  },
  SAT: {
    type: "glb",
    model: sateliteGlb,
    scale: [0.5, 0.5, 0.5],
    position: [0, 0.3, 0],
    hasSmoke: false,
    size: 1,
  },
  ESTRUTURAA: {
    type: "glb",
    model: structure,
    scale: [0.3, 0.3, 0.3],
    position: [0, -0.0, 0],
    rotation: 60 * DEG_TO_RAD,
    variantTextures: [variantAB, variantAB, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  ESTRUTURAB: {
    type: "glb",
    model: structure,
    scale: [0.3, 0.3, 0.3],
    position: [0, -0.4, 0],
    rotation: 60 * DEG_TO_RAD,
    hasSmoke: true,
    variantTextures: [variantAB, variantAB, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  ESTRUTURAC: {
    type: "glb",
    model: structure,
    scale: [0.3, 0.3, 0.3],
    position: [0, -0.8, 0],
    rotation: 60 * DEG_TO_RAD,
    variantTextures: [variantAB, variantAB, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  BASEAUTO: {
    type: "glb",
    model: baseAutoForno,
    scale: [0.3, 0.3, 0.3],
    position: [0, -0.0, 0],
    rotation: 60 * DEG_TO_RAD,
    variantTextures: [colormap, variantAB, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  MEDIOAUTO: {
    type: "glb",
    model: baseAutoForno,
    scale: [0.3, 0.3, 0.3],
    position: [0, -0.4, 0],
    variantTextures: [colormap, variantAB, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  TOPOAUTO: {
    type: "glb",
    model: topoAutoForno,
    scale: [0.3, 0.3, 0.3],
    position: [0, -0.7, 0],
    variantTextures: [texturaEspaço, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  AUTO_FORNO: {
    type: "stacked",
    gridSize: 1,
    layoutY: [
      // térreo
      [{ type: "BASEAUTO", variant: 0 }],
      // segundo andar
      [{ type: "MEDIOAUTO", variant: 1 }],
      // topo
      [{ type: "TOPOAUTO", variant: 0 }],
    ],
  },
  ESTRUTURA_CONSTRUÇÃO: {
    type: "stacked",
    gridSize: 1,
    layoutY: [
      // térreo
      [{ type: "ESTRUTURAA", variant: 0 }],
      // segundo andar
      [{ type: "ESTRUTURAB", variant: 0 }],
      // topo
      [{ type: "ESTRUTURAC", variant: 0 }],
    ],
  },
  AUTO_FORNO_CONSTRUÇÃO: {
    type: "mini-composite",
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 2,
    layout: [
      // térreo
      { type: "AUTO_FORNO" },
      { type: "ESTRUTURA_CONSTRUÇÃO" },
      { type: "ESTRUTURA_CONSTRUÇÃO" },
      { type: "ESTRUTURA_CONSTRUÇÃO" },
    ],
  },
  USINA_SIDERURGICA_CONSTRUÇÃO: {
    type: "composite",
    size: 2,
    gridSize: 2,
    layout: [
      { type: "AUTO_FORNO_CONSTRUÇÃO"},
      { type: "GALPÃO_CONSTRUÇÃO"},
      { type: "GALPÃO_CONSTRUÇÃO"},
      
      { type: "GALPÃO_CONSTRUÇÃO"},
    ],
  },
  TESTE2: {
    type: "glb",
    model: teste2,
    scale: [0.5, 0.5, 0.5],
    position: [0, 0.3, 0],
    hasSmoke: false,
    size: 1,
  },

  FOGUETE: {
    type: "stacked",
    gridSize: 1,
    floors: 3, // ou layoutY: [...]
    layout: [
      // base floor
      { type: "TESTE2" },
      { type: "TESTE2" },
      { type: "TESTE2" },
      // ...
    ],
  },

  M: {
    type: "glb",
    model: buildingMGlb,
    scale: [0.6, 0.6, 0.6],
    position: [0.2, 0.2, 0.2],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  // Edifício 3x3 simples (HQ)
  HQ: {
    type: "glb",
    model: sateliteGlb,
    scale: [3, 3, 3],
    position: [0, 1.5, 0],
    hasSmoke: false,
    size: 3,
  },
  PLANTAÇÃOGRAOS: {
    type: "glb",
    model: plantaçãoDeGrãos,
    scale: [0.5, 0.7, 0.5],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 3,
  },
  PLANTAÇÃO_DE_VEGETAIS: {
    type: "glb",
    model: plantaçãoDeVegetais,
    scale: [0.5, 0.7, 0.5],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 3,
  },
  MADEIREIRA_CONSTRUÇÃO: {
    type: "glb",
    model: armazem,
    scale: [0.5, 0.6, 0.5],
    rotation: 0 * DEG_TO_RAD,
    position: [0.1, 0.1, -0.1],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  STARTUP_CONSTRUÇÃO: {
    type: "glb",
    model: edStartup,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  LAB_CONSTRUÇÃO: {
    type: "glb",
    model: lab,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [variantA, variantA, variantB],

    size: 1,
  },
  GALPÃO_CONSTRUÇÃO: {
    type: "glb",
    model: galpão,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [variantA, variantA, variantB],

    size: 1,
  },

  DATACENTER_CONSTRUÇÃO: {
    type: "glb",
    model: edDataCenter,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },

  HANGAR_CONSTRUÇÃO: {
    type: "glb",
    model: hangar1,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [colormap, colormap, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  SATELITE_CONSTRUÇÃO: {
    type: "glb",
    model: sateliteGlb,
    rotation: 90 * DEG_TO_RAD,
    scale: [0.7, 0.7, 0.7],
    position: [-1.2, 0.2, 1.6],
    hasSmoke: true,
    size: 1,
  },
  EDEMPRESA_CONSTRUÇÃO: {
    type: "glb",
    model: edEmpresas,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [texturaSpace, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  EDEMPRESA_CONSTRUÇÃO2: {
    type: "glb",
    model: edEmpresas,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [colormap],
    variantCount: 1,
    size: 1,
  },
  SERVIDOR_CONSTRUÇÃO: {
    type: "glb",
    model: edServidor,
    scale: [0.5, 0.6, 0.5],
    rotation: 90 * DEG_TO_RAD,
    position: [-0.1, 0.1, 0.1],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  PILHA_DE_TRONCOS: {
    type: "glb",
    model: pilhaTronco,
    scale: [0.3, 0.4, 0.3],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 1,
  },
  ARVORE_MADEIRA: {
    type: "glb",
    model: arvoreMadeira,
    scale: [0.3, 0.4, 0.3],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 3,
  },
  ARVORE_CORTADA: {
    type: "glb",
    model: arvoreCortada,
    scale: [0.3, 0.4, 0.3],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 1,
  },
  ARVORE_CORTADA2: {
    type: "glb",
    model: arvoreCortada2,
    scale: [0.3, 0.4, 0.3],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 1,
  },
  POMARES: {
    type: "glb",
    model: pomares,
    scale: [0.8, 0.5, 0.8],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 3,
  },
  EUCALIPTO: {
    type: "glb",
    model: eucalipto,
    scale: [0.2, 0.5, 0.2],
    position: [0, 0, 0],
    hasSmoke: false,
    size: 1,
  },
  PATESTE: {
    type: "glb",
    model: pa,
    scale: [1.2, 2.5, 1.2],
    position: [0, 0, 0],
    hasSmoke: false,
    variantTextures: [variantB, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  FAZENDA_ADMINISTRATIVA: {
    type: "glb",
    model: fazendaAdm,
    scale: [0.7, 1, 0.7],
    rotation: 90 * DEG_TO_RAD,
    position: [0, 0, 0],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  COOPERTATIVA_AGRICOLA: {
    type: "glb",
    model: cooperativaAgricola,
    scale: [0.7, 1, 0.7],
    rotation: 90 * DEG_TO_RAD,
    position: [0, 0, 0],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  CENTRO_DE_COMERCIO_DE_PLANTAÇÕES: {
    type: "glb",
    model: centroComercioPlantações,
    scale: [0.7, 1, 0.7],
    rotation: 90 * DEG_TO_RAD,
    position: [0, 0, 0],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  ARMAZEM: {
    type: "glb",
    model: armazem,
    scale: [0.5, 0.6, 0.5],
    rotation: 45 * DEG_TO_RAD,
    position: [0.1, 0.1, -0.1],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  SILO: {
    type: "glb",
    model: silo,
    scale: [1.5, 2, 1.5],
    rotation: 45 * DEG_TO_RAD,
    position: [-0.0, -0.2, -0.0],
    hasSmoke: false,
    variantTextures: [texturaSpace, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  PEDRAGIGANTE: {
    type: "glb",
    model: pedraMedia,
    scale: [1.0, 1.2, 1.0],
    rotation: 45 * DEG_TO_RAD,
    position: [-0.0, -0.0, -0.0],
    hasSmoke: false,
    variantTextures: [texturaSpace, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  PEDRAGRANDE: {
    type: "glb",
    model: pedraMedia,
    scale: [0.7, 1.0, 0.7],
    rotation: 45 * DEG_TO_RAD,
    position: [-0.0, 0.0, -0.0],
    hasSmoke: false,
    variantTextures: [colormap, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  PEDRAMEDIA: {
    type: "glb",
    model: rocha,
    scale: [0.5, 1.0, 0.5],
    rotation: 45 * DEG_TO_RAD,
    position: [-0.0, -0.0, -0.0],
    hasSmoke: false,
    variantTextures: [variantA, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  VACA: {
    type: "glb",
    model: vaca,
    scale: [1.5, 2.0, 1.5],
    rotation: 45 * DEG_TO_RAD,
    position: [-0.0, -0.2, -0.0],
    hasSmoke: false,
    variantTextures: [texturaSpace, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  // Vaca pequena para rebanhos
  CAMINHÃO: {
    type: "glb",
    model: caminhão,
    scale: [0.3, 0.4, 0.3], // Escala reduzida para caber 9 vacas em 1 lote
    rotation: 0,
    position: [0, -0.0, 0],
    hasSmoke: false,
    variantTextures: [variantA, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  VACA_PEQUENA: {
    type: "glb",
    model: vaca,
    scale: [0.3, 0.4, 0.3], // Escala reduzida para caber 9 vacas em 1 lote
    rotation: 0,
    position: [0, -0.0, 0],
    hasSmoke: false,
    variantTextures: [texturaSpace, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  GRANJA_PEQUENA: {
    type: "glb",
    model: galinha,
    scale: [0.3, 0.4, 0.3], // Escala reduzida para caber 9 galinhas em 1 lote
    rotation: 0,
    position: [0, -0.0, 0],
    hasSmoke: false,
    variantTextures: [texturaSpace, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  OVELHAS: {
    type: "glb",
    model: ovelhas,
    scale: [1.0, 1.2, 1.0], // Escala reduzida para caber 9 ovelhas em 1 lote
    rotation: 0,
    position: [-0.12, -0.1, -0.12],
    hasSmoke: false,
    variantTextures: [texturaSpace, variantA, variantB],
    hasVariants: true,
    variantCount: 3,
    size: 1,
  },
  CERCA_RETA: {
    type: "glb",
    model: cercaReta,
    scale: [0.3, 0.4, 0.3], // Escala reduzida para caber 9 vacas em 1 lote
    rotation: 0,
    position: [0, 0.08, 0],
    hasSmoke: false,
    size: 1,
  },
  CERCA_REDONDA: {
    type: "glb",
    model: cercaRedonda,
    scale: [0.3, 0.4, 0.3], // Escala reduzida para caber 9 vacas em 1 lote
    rotation: 0,
    position: [0, 0.08, 0],
    hasSmoke: false,
    size: 1,
  },

  // ===================================
  // REBANHO DE VACAS (9 vacas em 1 lote)
  // ===================================

  REBANHO_VACAS: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "VACA_PEQUENA", rotation: 0 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 45 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 90 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 135 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 225 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 315 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 0 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 270 * DEG_TO_RAD },
    ],
  },

  CONJUNTO_PEDRAS_GIGANTE: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "PEDRAGIGANTE", rotation: 0 * DEG_TO_RAD },
      { type: "PEDRAGIGANTE", rotation: 45 * DEG_TO_RAD },
      { type: "PEDRAGIGANTE", rotation: 90 * DEG_TO_RAD },
      { type: "PEDRAGIGANTE", rotation: 135 * DEG_TO_RAD },
      { type: "PEDRAGIGANTE", rotation: 180 * DEG_TO_RAD },
      { type: "PEDRAMEDIA", rotation: 225 * DEG_TO_RAD },
      { type: "PEDRAGIGANTE", rotation: 315 * DEG_TO_RAD },
      { type: "PEDRAMEDIA", rotation: 0 * DEG_TO_RAD },
      { type: "PEDRAMEDIA", rotation: 270 * DEG_TO_RAD },
    ],
  },
  CONJUNTO_INSTITUTO_DE_TECNOLOGIA_ALIMENTAR: {
    type: "composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 2, // Importante: ocupa apenas 1 lote!
    gridSize: 2, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "LAB_CONSTRUÇÃO", variant: 2, rotation: 45 * DEG_TO_RAD },
      { type: "EDEMPRESA_CONSTRUÇÃO2", variant: 2, rotation: 45 * DEG_TO_RAD },
      { type: "MADEIREIRA_ESQUERDA", rotation: 135 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_GRAOS", rotation: 180 * DEG_TO_RAD },
    ],
  },
  CONJUNTO_INSTITUTO_DE_BIOTECNOLOGIA: {
    type: "composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 2, // Importante: ocupa apenas 1 lote!
    gridSize: 2, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "LAB_CONSTRUÇÃO", variant: 2, rotation: 90 * DEG_TO_RAD },
      { type: "EDEMPRESA_CONSTRUÇÃO2", variant: 2, rotation: 0 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_GRAOS", rotation: 135 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_GRAOS", rotation: 180 * DEG_TO_RAD },
    ],
  },
  CONJUNTO_CENTRO_DE_PESQUISA_AGRÍCOLA: {
    type: "composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 2, // Importante: ocupa apenas 1 lote!
    gridSize: 2, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "LAB_CONSTRUÇÃO", variant: 2, rotation: 45 * DEG_TO_RAD },
      { type: "EDEMPRESA_CONSTRUÇÃO2", variant: 2, rotation: 45 * DEG_TO_RAD },
      { type: "MADEIREIRA_ESQUERDA", rotation: 135 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_GRAOS", rotation: 180 * DEG_TO_RAD },
    ],
  },
  CONJUNTO_CENTRO_DE_PESQUISA_ELETRÔNICA: {
    type: "composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 2, // Importante: ocupa apenas 1 lote!
    gridSize: 2, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "GALPÃO_CONSTRUÇÃO", variant: 2, rotation: 45 * DEG_TO_RAD },
      { type: "EDEMPRESA_CONSTRUÇÃO2", variant: 2, rotation: 45 * DEG_TO_RAD },
      { type: "LAB_CONSTRUÇÃO", rotation: 135 * DEG_TO_RAD },
      { type: "LAB_CONSTRUÇÃO", rotation: 180 * DEG_TO_RAD },
    ],
  },

  CONJUNTO_PEDRAS_GRANDES: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "PEDRAGRANDE", rotation: 0 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 45 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 90 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 135 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 180 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 225 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 315 * DEG_TO_RAD },
      { type: "PEDRAMEDIA", rotation: 0 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 270 * DEG_TO_RAD },
    ],
  },

  CONJUNTO_PEDRAS_MEDIAS: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "PEDRAGRANDE", rotation: 0 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 45 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 90 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 135 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 180 * DEG_TO_RAD },
      { type: "PEDRAMEDIA", rotation: 225 * DEG_TO_RAD },
      { type: "PEDRAGRANDE", rotation: 315 * DEG_TO_RAD },
      { type: "PEDRAMEDIA", rotation: 0 * DEG_TO_RAD },
      { type: "PEDRAMEDIA", rotation: 270 * DEG_TO_RAD },
    ],
  },

  REBANHO_VACAS_BAIXO: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "VACA_PEQUENA", rotation: 0 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 45 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 135 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_REDONDA", rotation: 270 * DEG_TO_RAD },
    ],
  },
  REBANHO_VACAS_ESQUERDA: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 45 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 45 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 45 * DEG_TO_RAD },
      { type: "CERCA_REDONDA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
    ],
  },
  REBANHO_VACAS_DIREITA: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_REDONDA", rotation: 0 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 0 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 270 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
    ],
  },
  REBANHO_VACAS_TOPO: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "CERCA_REDONDA", rotation: 90 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 90 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 270 * DEG_TO_RAD },
      { type: "VACA_PEQUENA", rotation: 270 * DEG_TO_RAD },
    ],
  },

  GRANJA_DE_AVES_BAIXO: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "GRANJA_PEQUENA", rotation: 0 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 270 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_REDONDA", rotation: 270 * DEG_TO_RAD },
    ],
  },
  GRANJA_DE_AVES_ESQUERDA: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 45 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_REDONDA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 180 * DEG_TO_RAD },
    ],
  },
  GRANJA_DE_AVES_DIREITA: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_REDONDA", rotation: 0 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 0 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 270 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 270 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 270 * DEG_TO_RAD },
    ],
  },
  GRANJA_DE_AVES_TOPO: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "CERCA_REDONDA", rotation: 90 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 0 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 180 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 90 * DEG_TO_RAD },
      { type: "CERCA_RETA", rotation: 90 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 270 * DEG_TO_RAD },
      { type: "GRANJA_PEQUENA", rotation: 270 * DEG_TO_RAD },
    ],
  },

  MADEIREIRA_ESQUERDA: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "ARVORE_MADEIRA", rotation: 90 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 180 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 45 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 90 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 180 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 180 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 180 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 180 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 180 * DEG_TO_RAD },
    ],
  },
  MADEIREIRA_DIREITA: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "ARVORE_MADEIRA", rotation: 0 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 0 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 0 * DEG_TO_RAD },
      { type: "ARVORE_MADEIRA", rotation: 0 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 270 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 270 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 180 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 270 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 270 * DEG_TO_RAD },
    ],
  },
  MADEIREIRA_BAIXO: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "PILHA_DE_TRONCOS", rotation: 90 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 0 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 0 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 90 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 180 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 90 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 90 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 270 * DEG_TO_RAD },
      { type: "PILHA_DE_TRONCOS", rotation: 270 * DEG_TO_RAD },
    ],
  },

  PLANTAÇÃO_DE_EUCALIPTO: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "EUCALIPTO", rotation: 90 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 0 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 0 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 90 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 180 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 90 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 90 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 270 * DEG_TO_RAD },
      { type: "EUCALIPTO", rotation: 270 * DEG_TO_RAD },
    ],
  },

  PLANTAÇÃO_DE_GRAOS: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "PLANTAÇÃOGRAOS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 0 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 0 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 180 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 270 * DEG_TO_RAD },
      { type: "PLANTAÇÃOGRAOS", rotation: 270 * DEG_TO_RAD },
    ],
  },

  PLANTAÇÃO_DE_VEGETAIS_CONJ: {
    type: "mini-composite", // Novo tipo para compostos que ocupam apenas 1 lote
    size: 1, // Importante: ocupa apenas 1 lote!
    gridSize: 3, // Grid interno 3x3 para posicionar as vacas
    layout: [
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 0 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 0 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 180 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 90 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 270 * DEG_TO_RAD },
      { type: "PLANTAÇÃO_DE_VEGETAIS", rotation: 270 * DEG_TO_RAD },
    ],
  },

  // ===================================
  // NOVO MEGA BLOCO (Composto 3x3)
  // ===================================
  MEGA_BLOCO: {
    type: "composite",
    size: 3,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "L", variant: 0 },
      { type: "L", variant: 0 },
      { type: "L", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "A", variant: 0 },
      { type: "A", variant: 0 },
      { type: "A", variant: 0 }, // Linha 2 (Índice 3, 4, 5)
      { type: "M", variant: 0 },
      { type: "B", variant: 0 },
      { type: "SAT", variant: 0 }, // Linha 3 (Índice 6, 7, 8)
    ],
  },
  MEGA_Vacas: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "REBANHO_VACAS_TOPO", variant: 0 },
      { type: "REBANHO_VACAS_DIREITA", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "REBANHO_VACAS_ESQUERDA", variant: 0 },
      { type: "REBANHO_VACAS_BAIXO", variant: 0 }, // Linha 2 (Índice 3, 4, 5) // Linha 3 (Índice 6, 7, 8)
      ,
      ,
    ],
  },
  GRANJA_DE_AVES: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "GRANJA_DE_AVES_TOPO", variant: 0 },
      { type: "GRANJA_DE_AVES_DIREITA", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "GRANJA_DE_AVES_ESQUERDA", variant: 0 },
      { type: "GRANJA_DE_AVES_BAIXO", variant: 0 }, // Linha 2 (Índice 3, 4, 5) // Linha 3 (Índice 6, 7, 8)
      ,
      ,
    ],
  },
  CRIAÇÃO_DE_OVINOS: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "OVELHAS", variant: 0 },
      { type: "OVELHAS", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "OVELHAS", variant: 0 },
      { type: "OVELHAS", variant: 0 }, // Linha 2 (Índice 3, 4, 5) // Linha 3 (Índice 6, 7, 8)
      ,
    ],
  },
  MADEIREIRA: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.

    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "MADEIREIRA_CONSTRUÇÃO", variant: 0 },
      { type: "MADEIREIRA_DIREITA", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "MADEIREIRA_ESQUERDA", variant: 0 },
      { type: "MADEIREIRA_BAIXO", variant: 0 }, // Linha 2 (Índice 3, 4, 5) // Linha 3 (Índice 6, 7, 8)
      ,
    ],
  },
  MEGA_BLOCO_PLANT: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "PLANTAÇÃOGRAOS", variant: 0 },
      { type: "PLANTAÇÃOGRAOS", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "PLANTAÇÃOGRAOS", variant: 0 },
      { type: "PLANTAÇÃOGRAOS", variant: 0 }, // Linha 2 (Índice 3, 4, 5)
      // Linha 3 (Índice 6, 7, 8)
    ],
  },
  PLANTAÇÃO_DE_EUCALIPTO_TOTAL: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "PLANTAÇÃO_DE_EUCALIPTO", variant: 0 },
      { type: "PLANTAÇÃO_DE_EUCALIPTO", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "PLANTAÇÃO_DE_EUCALIPTO", variant: 0 },
      { type: "PLANTAÇÃO_DE_EUCALIPTO", variant: 0 }, // Linha 2 (Índice 3, 4, 5)
      // Linha 3 (Índice 6, 7, 8)
    ],
  },
  PLANTAÇÃO_DE_GRAOS_TOTAL: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "PLANTAÇÃO_DE_GRAOS", variant: 0 },
      { type: "PLANTAÇÃO_DE_GRAOS", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "PLANTAÇÃO_DE_GRAOS", variant: 0 },
      { type: "PLANTAÇÃO_DE_GRAOS", variant: 0 }, // Linha 2 (Índice 3, 4, 5)
      // Linha 3 (Índice 6, 7, 8)
    ],
  },
  PLANTAÇÃO_DE_VEGETAIS_TOTAL: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "PLANTAÇÃO_DE_VEGETAIS_CONJ", variant: 0 },
      { type: "PLANTAÇÃO_DE_VEGETAIS_CONJ", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "PLANTAÇÃO_DE_VEGETAIS_CONJ", variant: 0 },
      { type: "PLANTAÇÃO_DE_VEGETAIS_CONJ", variant: 0 }, // Linha 2 (Índice 3, 4, 5)
      // Linha 3 (Índice 6, 7, 8)
    ],
  },
  MEGA_BLOCO_VEGETAIS: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "PLANTAÇÃO_VEGETAIS", variant: 1 },
      { type: "PLANTAÇÃO_VEGETAIS", variant: 1 }, // Linha 1 (Índice 0, 1, 2)
      { type: "PLANTAÇÃO_VEGETAIS", variant: 1 },
      { type: "PLANTAÇÃO_VEGETAIS", variant: 1 }, // Linha 2 (Índice 3, 4, 5)
      // Linha 3 (Índice 6, 7, 8)
    ],
  },
  BLOCO_POMARES: {
    type: "composite",
    size: 2,
    // Mapeamento do layout interno (Baseado no pedido: 1-1, 1-2, 1-3 etc. -> 0,0, 0,1, 0,2 no array)
    // O array é indexado de 0 a 8, representando as 9 posições.
    // Posição: [linha_do_bloco][coluna_do_bloco]
    layout: [
      { type: "POMARES", variant: 0 },
      { type: "POMARES", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "POMARES", variant: 0 },
      { type: "POMARES", variant: 0 }, // Linha 2 (Índice 3, 4, 5)
      // Linha 3 (Índice 6, 7, 8)
    ],
  },
  TERRENO_DE_MINERAÇÃO: {
    type: "composite",
    size: 3,
    layout: [
      { type: "CONJUNTO_PEDRAS_GIGANTE", variant: 1 },
      { type: "CONJUNTO_PEDRAS_GIGANTE", variant: 0 },
      { type: "CONJUNTO_PEDRAS_GIGANTE", variant: 0 }, // Linha 1 (Índice 0, 1, 2)
      { type: "CONJUNTO_PEDRAS_GIGANTE", variant: 0 },
      { type: "CONJUNTO_PEDRAS_GRANDES", variant: 0 },
      { type: "CONJUNTO_PEDRAS_GRANDES", variant: 0 }, // Linha 2 (Índice 3, 4, 5)
      { type: "CONJUNTO_PEDRAS_GIGANTE", variant: 0 },
      { type: "CONJUNTO_PEDRAS_GRANDES", variant: 0 },
      { type: "PEDRAMEDIA", variant: 0 },
      // Linha 3 (Índice 6, 7, 8)
    ],
    // Para converter as posições do usuário (1-1 até 3-3) para o índice do array (0 a 8):
    // Posição (r, c) de 1 a 3 -> Índice = (r - 1) * 3 + (c - 1)
    // Ex: (1, 1) -> (0) * 3 + (0) = 0
    // Ex: (3, 3) -> (2) * 3 + (2) = 8
  },
};

// ==== Fumaça ====
function Smoke({ startY = 0.6 }) {
  const ref = useRef();
  const speed = 0.3 + Math.random() * 0.2;
  const size = 0.1 + Math.random() * 0.05;

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.y += delta * speed;
      ref.current.material.opacity -= delta * 0.2;
      if (ref.current.material.opacity <= 0) {
        ref.current.position.y = startY;
        ref.current.material.opacity = 0.6;
      }
    }
  });

  return (
    <mesh ref={ref} position={[0, startY, 0]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color="#ccc" transparent opacity={0.6} />
    </mesh>
  );
}

// ==== Modelo GLB ====
function GLBModel({
  url,
  scale,
  position,
  variant,
  textureMapUrl,
  rotationY = 0,
}) {
  const gltf = useLoader(GLTFLoader, url);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf]);
  const texture = textureMapUrl
    ? useLoader(TextureLoader, textureMapUrl)
    : null;

  // Corrigir textura, se houver
  if (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  // Corrigir materiais e iluminação do modelo
  clonedScene.traverse((child) => {
    if (child.isMesh && child.material) {
      // Forçar materiais PBR a ficarem visíveis e com contraste
      child.material.envMapIntensity = 1.2;
      child.material.metalness = 0.1;
      child.material.roughness = 0.4;
      child.material.toneMapped = true;
      child.material.needsUpdate = true;

      // Garantir que transparência não esteja afetando a aparência
      if (child.material.transparent) {
        child.material.transparent = false;
        child.material.opacity = 1;
      }

      // Aplicar textura personalizada, se houver
      if (texture) {
        child.material.map = texture;
        child.material.color.set(0xffffff);
        child.material.needsUpdate = true;
      }

      // Corrigir color space (muito importante)
      if (child.material.map) {
        child.material.map.colorSpace = THREE.SRGBColorSpace;
      }

      // Corrigir cor base se estiver muito “lavada”
      // if (child.material.color) {
      //   child.material.color.convertSRGBToLinear();
      // }
    }
  });

  return (
    <group scale={scale} position={position} rotation={[0, rotationY, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ==== Prédios (Recursivo) ====
// Este componente agora lida tanto com edifícios simples quanto compostos.
function Building({ type, variant, size = 1, rotation = 0 }) {
  const config = BUILDING_CONFIGS[type];

  if (!config) {
    return (
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
    );
  }

  // 1. Lógica para o Mega Bloco COMPOSITE
  if (config.type === "composite") {
    return (
      <group>
        {config.layout.map((subBuilding, index) => {
          // Determina a linha e coluna (0 a 2) dentro do bloco 3x3
          const r = Math.floor(index / config.size);
          const c = index % config.size;

          // Calcula a posição do centro do lote 1x1 dentro do bloco 3x3
          // O deslocamento é baseado no LOT_SPACING.
          // O âncora é (0,0), então o centro é (0.5 * LOT_SPACING, 0.5 * LOT_SPACING)
          // Mas como os Building Groups já estão centralizados no 1x1,
          // a posição é simplesmente o índice * espaçamento.
          const xOffset = c * LOT_SPACING;
          const zOffset = r * LOT_SPACING;

          // O "corpo" do edifício composto deve estar centrado no bloco 3x3 total
          // O centro do bloco 3x3 está em (1.2, 1.2) em coordenadas do lote
          // O deslocamento deve ser do centro do lote 1x1 para o canto do lote 3x3
          // O âncora (0,0) está no canto.

          // Para centralizar o 1x1 no seu sub-lote (c, r) do 3x3:
          // c * LOT_SPACING (x) - 1 * LOT_SPACING (para centro do 3x3)
          const centerAdjustment = ((config.size - 1) / 2) * LOT_SPACING;

          const finalX = xOffset - centerAdjustment;
          const finalZ = zOffset - centerAdjustment;

          return (
            <group key={index} position={[finalX, 0, finalZ]}>
              <Suspense fallback={null}>
                {/* Recursão para renderizar o sub-componente */}
                <Building
                  type={subBuilding.type}
                  variant={subBuilding.variant}
                  size={1}
                />
              </Suspense>
            </group>
          );
        })}
      </group>
    );
  }

  if (config.type === "mini-composite") {
    const gridSize = config.gridSize || 3;
    const spacing = 0.35;
    return (
      <group>
        {config.layout.map((subBuilding, index) => {
          const r = Math.floor(index / gridSize);
          const c = index % gridSize;
          const xOffset = (c - (gridSize - 1) / 2) * spacing;
          const zOffset = (r - (gridSize - 1) / 2) * spacing;
          return (
            <group key={index} position={[xOffset, 0, zOffset]}>
              <Suspense fallback={null}>
                <Building
                  type={subBuilding.type}
                  variant={subBuilding.variant}
                  size={1}
                  rotation={subBuilding.rotation || 0}
                />
              </Suspense>
            </group>
          );
        })}
      </group>
    );
  }

  if (config.type === "stacked") {
    const gridSize = config.gridSize || 3;
    const spacing = 0.35;
    const floorHeight = 0.7; // altura de cada andar

    // Verifica se há layoutY (andares distintos) ou usa layout único repetido
    const floorLayouts = config.layoutY || [config.layout];
    const floors = floorLayouts.length;

    return (
      <group>
        {floorLayouts.map((floorLayout, floorIndex) => {
          const yOffset = floorIndex * floorHeight;
          return (
            <group key={`floor-${floorIndex}`} position={[0, yOffset, 0]}>
              {floorLayout.map((subBuilding, index) => {
                const r = Math.floor(index / gridSize);
                const c = index % gridSize;
                const xOffset = (c - (gridSize - 1) / 2) * spacing;
                const zOffset = (r - (gridSize - 1) / 2) * spacing;

                return (
                  <group
                    key={`b-${floorIndex}-${index}`}
                    position={[xOffset, 0, zOffset]}
                  >
                    <Suspense fallback={null}>
                      <Building
                        type={subBuilding.type}
                        variant={subBuilding.variant}
                        size={1}
                        rotation={subBuilding.rotation || 0}
                      />
                    </Suspense>
                  </group>
                );
              })}
            </group>
          );
        })}
      </group>
    );
  }

  // 2. Lógica para modelos GLB (HQ e SAT)
  if (config.type === "glb") {
    let textureUrl = null;
    if (config.variantTextures && variant !== undefined) {
      textureUrl = config.variantTextures[variant] || config.variantTextures[0];
    }
    const modelOffset = config.position;

    return (
      <Suspense fallback={null}>
        <GLBModel
          url={config.model}
          scale={config.scale}
          position={modelOffset}
          variant={variant}
          textureMapUrl={textureUrl}
          rotationY={rotation}
        />
      </Suspense>
    );
  }

  // 3. Lógica para caixas com TEXTURA (L, A, B)
  if (config.type === "texture") {
    const texture = useLoader(TextureLoader, config.texture);
    return (
      <group>
        <mesh position={config.position}>
          <boxGeometry args={[size * 0.8, size * 1, size * 0.8]} />
          <meshStandardMaterial map={texture} />
        </mesh>
        {config.hasSmoke &&
          Array.from({ length: 4 }).map((_, i) => (
            <Smoke key={i} startY={1 + Math.random() * 0.3} />
          ))}
      </group>
    );
  }

  return null;
}

// ==== Lotes ====
function Lot({
  position,
  onClick,
  isAnchor,
  isOccupied,
  buildingData,
  rotation = 0,
}) {
  const buildingType = buildingData?.type;
  const buildingSize = buildingData?.size || 1;

  // Cor do chão
  let color = isOccupied ? "#6b8e23" : "#8B4513";

  // Se for parte de um edifício composto (MEGA_BLOCO), muda a cor do chão
  if (buildingType === "MEGA_BLOCO") {
    color = "#4a6c31";
  }

  // Se este lote for o ponto de âncora do edifício:
  if (isAnchor) {
    // Calculamos o deslocamento necessário para centralizar o edifício
    // Se o edifício for 1x1, offset = 0
    // Se for 3x3, offset = (3-1)/2 * 1.2 = 1.2
    const centerOffset = ((buildingSize - 1) / 2) * LOT_SPACING;

    return (
      <group>
        {/* Base do Lote (1x1) - Fica no canto do bloco para a âncora */}
        <mesh position={position} onClick={onClick}>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Renderiza a construção na posição centralizada do bloco */}
        <group
          rotation={[0, buildingData?.rotation || 0, 0]}
          position={[position[0] + centerOffset, 0, position[2] + centerOffset]}
        >
          <Suspense fallback={null}>
            <Building
              type={buildingType}
              variant={buildingData?.variant}
              size={buildingSize}
              rotation={buildingData?.rotation || 0}
            />
          </Suspense>
        </group>
      </group>
    );
  }

  // Se for um lote ocupado, mas NÃO a âncora (ou seja, lote vizinho do 3x3)
  if (isOccupied) {
    return (
      <mesh position={position} onClick={onClick}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  // Lote vazio
  return (
    <mesh position={position} onClick={onClick}>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// ===========================================
// LÓGICA DE VERIFICAÇÃO DE LOTE OCUPADO (Multi-size)
// ===========================================
const getBuildingAtLot = (x, z, currentBuildings) => {
  // 1. Verifica se o lote é um ANCHOR
  const key = `${x},${z}`;
  if (currentBuildings[key]) {
    const data = currentBuildings[key];
    return { isAnchor: true, isOccupied: true, data, anchorKey: key };
  }

  // 2. Verifica se o lote é PARTE de um edifício maior (não-âncora)
  for (const anchorKey in currentBuildings) {
    const data = currentBuildings[anchorKey];
    const size = data.size || 1;

    if (size > 1) {
      // Posição do âncora
      const [ax, az] = anchorKey.split(",").map(Number);

      // Verifica se (x, z) está dentro do bounding box [ax, az] até [ax + size - 1, az + size - 1]
      if (x >= ax && x < ax + size && z >= az && z < az + size) {
        return { isAnchor: false, isOccupied: true, data, anchorKey };
      }
    }
  }

  return { isAnchor: false, isOccupied: false, data: null, anchorKey: null };
};

// Utility para checar se a área size x size está limpa
const isAreaClear = (startX, startZ, size, currentBuildings) => {
  for (let x = startX; x < startX + size; x++) {
    for (let z = startZ; z < startZ + size; z++) {
      // O lote não pode estar ocupado por NENHUM edifício
      if (getBuildingAtLot(x, z, currentBuildings).isOccupied) {
        return false;
      }
    }
  }
  return true;
};

// ==== Menu ====
function BuildMenu({
  x,
  y,
  options,
  onSelect,
  onClose,
  currentType,
  onMove,
  onDemolish,
  onChangeVariant,
  currentVariant,
  maxVariants,
  isMultiSize,
}) {
  const hasBuilding = !!currentType;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -110%)",
        background: "white",
        padding: 8,
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        zIndex: 100,
        minWidth: 200,
      }}
    >
      {hasBuilding ? (
        // Menu para edifícios existentes
        <>
          <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>
            Edifício {currentType}{" "}
            {isMultiSize &&
              `(${BUILDING_CONFIGS[currentType].size}x${BUILDING_CONFIGS[currentType].size})`}
          </div>

          {/* Seletor de variação (apenas para edifícios que têm variações) */}
          {maxVariants > 1 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ fontSize: 12, color: "#666" }}>
                Variação: {currentVariant + 1} / {maxVariants}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: maxVariants }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onChangeVariant(idx)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      background:
                        currentVariant === idx ? "#3498db" : "#ecf0f1",
                      color: currentVariant === idx ? "white" : "#333",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: currentVariant === idx ? "bold" : "normal",
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onMove}
            style={{
              width: "100%",
              padding: "8px 16px",
              background: "#3498db",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            🚚 Mover
          </button>
          <button
            onClick={onDemolish}
            style={{
              width: "100%",
              padding: "8px 16px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            💥 Demolir
          </button>
        </>
      ) : (
        // Menu para construir
        <>
          <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>
            Construir:
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {options.map((opt) => (
              <div
                key={opt.type}
                onClick={() => onSelect(opt.type)}
                style={{
                  width: 50,
                  height: 50,
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f5f5f5",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#333",
                  lineHeight: 1.2,
                }}
              >
                <div>{opt.label || opt.type}</div>
                <div style={{ fontSize: 10, fontWeight: "normal" }}>
                  {BUILDING_CONFIGS[opt.type].size}x
                  {BUILDING_CONFIGS[opt.type].size}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <button
        onClick={onClose}
        style={{
          marginTop: 4,
          padding: "4px 12px",
          background: "#95a5a6",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 12,
        }}
      >
        Fechar
      </button>
    </div>
  );
}

// ==== Principal ====
export default function MapaLowPoly() {
  const [buildings, setBuildings] = useState({});
  const [menuPos, setMenuPosition] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null); // Key do lote de âncora
  const [movingMode, setMovingMode] = useState({
    active: false,
    fromLot: null,
    buildingData: null,
  });

  const options = useMemo(
    () => [
      // { type: "L", label: "Casa L" },
      // { type: "A", label: "Casa A" },
      // { type: "B", label: "Casa B" },
      // { type: "SAT", label: "Satélite" },
      // { type: "M", label: "Prédio M" },
      // { type: "HQ", label: "HQ" },
      // { type: "PLANTAÇÃO_DE_GRAOS_TOTAL", label: "Plantações de Grãos" },
      // { type: "MEGA_BLOCO", label: "Mega Bloco" }, // Novo
      // { type: "MEGA_BLOCO_PLANT", label: "Mega plantação" }, // Novo
      // { type: "MEGA_BLOCO_VEGETAIS", label: "Mega vegetais" }, // Novo
      // { type: "BLOCO_POMARES", label: "Mega pomares" }, // Novo
      { type: "FAZENDA_ADMINISTRATIVA", label: "Fazenda adm" }, // Novo
      // { type: "COOPERTATIVA_AGRICOLA", label: "Cooperativa Agrícola" }, // Novo
      // { type: "CENTRO_DE_COMERCIO_DE_PLANTAÇÕES", label: "Centro de Comércio de Plantações" }, // Novo
      { type: "ARMAZEM", label: "Armazém" }, // Novo
      // { type: "SILO", label: "Silagem" }, // Novo
      // { type: "ARMAZEM", label: "Depósito de resíduos" }, // Novo
      // { type: "VACA", label: "Vaca" }, // Novo
      // { type: "MEGA_Vacas", label: "VacaWWWWWWW" }, // Novo
      // { type: "REBANHO_VACAS", label: "REBANHO_VACAS" }, // Novo
      // { type: "GRANJA_DE_AVES", label: "GRANJA_DE_AVES" }, // Novo
      // { type: "OVELHAS", label: "OVELHAS" }, // Novo
      // { type: "CRIAÇÃO_DE_OVINOS", label: "CRIAÇÃO_DE_OVINOS" }, // Novo
      // { type: "MADEIREIRA", label: "MADEIREIRA" }, // Novo
      // { type: "PLANTAÇÃO_DE_EUCALIPTO_TOTAL", label: "PLANTAÇÃO_DE_EUCALIPTO" }, // Novo
      // { type: "PLANTAÇÃO_DE_VEGETAIS_TOTAL", label: "PLANTAÇÃO_DE_VEGETAIS_TOTAL" }, // Novo
      // { type: "TERRENO_DE_MINERAÇÃO", label: "TERRENO_DE_MINERAÇÃO" }, // Novo
      // { type: "PATESTE", label: "PATESTE" }, // Novo
      // { type: "STARTUP_CONSTRUÇÃO", label: "STARTUP" }, // Novo
      // { type: "SERVIDOR_CONSTRUÇÃO", label: "SERVIDOR" }, // Novo
      // { type: "DATACENTER_CONSTRUÇÃO", label: "DATACENTER" }, // Novo
      // { type: "EDEMPRESA_CONSTRUÇÃO", label: "EMPRESA DESENV" }, // Novo
      // { type: "EDEMPRESA_CONSTRUÇÃO", label: "EDEMPRESA JOGOS" }, // Novo
      // { type: "SATELITE_CONSTRUÇÃO", label: "SATELITE" }, // Novo
      // { type: "HANGAR_CONSTRUÇÃO", label: "HANGAR" }, // Novo
      // { type: "TESTE", label: "TESTE" }, // Novo
      // { type: "TESTE2", label: "TESTE2" }, // Novo
      // { type: "FOGUETE", label: "FOGUETE" }, // Novo
      // { type: "AUTO_FORNO", label: "AUTO_FORNO" }, // Novo
      // { type: "ESTRUTURA_CONSTRUÇÃO", label: "ESTRUTURA_CONSTRUÇÃO" }, // Novo
      // { type: "AUTO_FORNO_CONSTRUÇÃO", label: "AUTO_FORNO_CONSTRUÇÃO" }, // Novo
      // { type: "LAB_CONSTRUÇÃO", label: "LABORATÓRIO" }, // Novo
      { type: "USINA_SIDERURGICA_CONSTRUÇÃO", label: "USINA_SIDERURGICA_CONSTRUÇÃO" }, // Novo
      { type: "GALPÃO_CONSTRUÇÃO", label: "GALPÃO_CONSTRUÇÃO  " }, // Novo
      // {
      //   type: "CONJUNTO_INSTITUTO_DE_TECNOLOGIA_ALIMENTAR",
      //   label: "CONJUNTO_INSTITUTO_DE_TECNOLOGIA_ALIMENTAR",
      // }, // Novo
      // {
      //   type: "CONJUNTO_INSTITUTO_DE_BIOTECNOLOGIA",
      //   label: "CONJUNTO_INSTITUTO_DE_BIOTECNOLOGIA",
      // }, // Novo
      
      {
        type: "CONJUNTO_CENTRO_DE_PESQUISA_AGRÍCOLA",
        label: "CONJUNTO_CENTRO_DE_PESQUISA_AGRÍCOLA",
      }, // Novo
    ],
    []
  );

  const handleLotClick = (x, z) => {
    const { isOccupied, data, anchorKey } = getBuildingAtLot(x, z, buildings);

    // Se estiver no modo de mover
    if (movingMode.active) {
      const size = movingMode.buildingData.size || 1;

      if (!isOccupied && isAreaClear(x, z, size, buildings)) {
        // Lote vazio e área limpa - move o edifício para cá
        setBuildings((prev) => {
          const newBuildings = { ...prev };
          newBuildings[`${x},${z}`] = movingMode.buildingData;
          delete newBuildings[movingMode.fromLot];
          return newBuildings;
        });
        setMovingMode({ active: false, fromLot: null, buildingData: null });
        setMenuPosition(null);
        setSelectedLot(null);
      }
      return;
    }

    // Se o lote clicado for o âncora OU parte de um edifício:
    if (isOccupied) {
      setSelectedLot(anchorKey); // Seleciona o lote de âncora
    } else {
      setSelectedLot(`${x},${z}`); // Lote vazio, prepara para construir aqui
    }
  };

  const handleSelectBuilding = (type) => {
    if (selectedLot) {
      const config = BUILDING_CONFIGS[type];
      const size = config.size || 1;
      const [startX, startZ] = selectedLot.split(",").map(Number);

      // VERIFICA SE A ÁREA ESTÁ LIVRE
      if (isAreaClear(startX, startZ, size, buildings)) {
        setBuildings((prev) => ({
          ...prev,
          [selectedLot]: {
            type,
            variant: config.variant || 0,
            size: size,
            rotation: config.rotation || 0,
          },
        }));
        setSelectedLot(null);
        setMenuPosition(null);
      } else {
        console.error(
          "Área não está limpa para construir este edifício de tamanho",
          size,
          "x",
          size
        );
        setMenuPosition(null);
        setSelectedLot(null);
      }
    }
  };

  const handleMove = () => {
    if (selectedLot && buildings[selectedLot]) {
      setMovingMode({
        active: true,
        fromLot: selectedLot,
        buildingData: buildings[selectedLot],
      });
      setSelectedLot(null);
      setMenuPosition(null);
    }
  };

  const handleDemolish = () => {
    if (selectedLot) {
      setBuildings((prev) => {
        const newBuildings = { ...prev };

        // Se o edifício for um MEGA_BLOCO, vamos limpar a área inteira
        const data = newBuildings[selectedLot];
        const size = data.size || 1;

        // Simplesmente deletamos a âncora, a lógica getBuildingAtLot fará o resto.
        delete newBuildings[selectedLot];

        return newBuildings;
      });
      setSelectedLot(null);
      setMenuPosition(null);
    }
  };

  const handleChangeVariant = (newVariant) => {
    if (selectedLot && buildings[selectedLot]) {
      setBuildings((prev) => ({
        ...prev,
        [selectedLot]: {
          ...prev[selectedLot],
          variant: newVariant,
        },
      }));
    }
  };

  const handleRandomBuilding = () => {
    const buildingTypes = Object.keys(BUILDING_CONFIGS);
    const randomType =
      buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
    const config = BUILDING_CONFIGS[randomType];
    const randomVariant = config.hasVariants
      ? Math.floor(Math.random() * config.variantCount)
      : config.variant || 0;
    const size = config.size || 1;

    // Tenta encontrar uma posição aleatória limpa
    const gridSize = 50;
    const offset = (gridSize - 1) / 2;
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      const x = Math.floor(Math.random() * (gridSize - size)) - offset;
      const z = Math.floor(Math.random() * (gridSize - size)) - offset;
      const key = `${x},${z}`;

      if (isAreaClear(x, z, size, buildings)) {
        setBuildings((prev) => ({
          ...prev,
          [key]: {
            type: randomType,
            variant: randomVariant,
            size: size,
          },
        }));
        break;
      }
      attempts++;
    }
    if (attempts === maxAttempts) {
      console.error(
        "Não foi possível encontrar um espaço vazio para o edifício",
        randomType
      );
    }
  };

  const { isOccupied: isSelectedLotOccupied, data: currentBuildingData } =
    selectedLot
      ? getBuildingAtLot(
          selectedLot.split(",").map(Number)[0],
          selectedLot.split(",").map(Number)[1],
          buildings
        )
      : { isOccupied: false, data: null };

  const currentType = currentBuildingData?.type;
  const currentConfig = currentType ? BUILDING_CONFIGS[currentType] : null;

  // Lógica de variação apenas para edifícios 1x1 com variantes
  const isSingleVariant =
    currentConfig?.hasVariants && currentConfig.size === 1;
  const currentVariant = isSingleVariant
    ? currentBuildingData?.variant || 0
    : 0;
  const maxVariants = isSingleVariant ? currentConfig?.variantCount || 1 : 1;
  const isMultiSize = (currentConfig?.size || 1) > 1;

  // Componente interno para lidar com a lógica de clique e projeção do menu
  function GridWrapper(props) {
    const { camera } = useThree();
    const size = 50;
    const offset = (size - 1) / 2;

    const internalHandleClick = (x, z) => {
      const { isOccupied, data, anchorKey } = getBuildingAtLot(
        x,
        z,
        props.buildings
      );

      // Lógica do modo de mover: passa para o manipulador externo
      if (props.movingMode.active) {
        props.handleLotClick(x, z);
        return;
      }

      // 1. Projeção da posição para a tela (para o menu)
      const lotKey = isOccupied ? anchorKey : `${x},${z}`;
      const [lx, lz] = lotKey.split(",").map(Number);
      const configSize = (isOccupied ? data.size : 1) || 1;

      // Projeta a posição do centro do bloco para a tela
      const centerOffset = ((configSize - 1) / 2) * LOT_SPACING;
      const vector = new THREE.Vector3(
        lx * LOT_SPACING + centerOffset,
        0,
        lz * LOT_SPACING + centerOffset
      );

      vector.project(camera);
      const canvas = document.querySelector("canvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      props.setMenuPosition({
        x: (vector.x * 0.5 + 0.5) * rect.width + rect.left,
        y: (-vector.y * 0.5 + 0.5) * rect.height + rect.top,
      });

      // 2. Chama o manipulador externo para atualizar o estado
      props.handleLotClick(x, z);
    };

    return (
      <>
        {Array.from({ length: size }).map((_, i) =>
          Array.from({ length: size }).map((_, j) => {
            const x = i - offset;
            const z = j - offset;
            const key = `${x},${z}`;

            const { isAnchor, isOccupied, data } = getBuildingAtLot(
              x,
              z,
              props.buildings
            );

            return (
              <Lot
                key={key}
                position={[x * LOT_SPACING, 0, z * LOT_SPACING]}
                isAnchor={isAnchor}
                isOccupied={isOccupied}
                buildingData={data}
                onClick={() => internalHandleClick(x, z)}
              />
            );
          })
        )}
      </>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Botão de edifício aleatório */}
      <button
        onClick={handleRandomBuilding}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "12px 20px",
          background: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        🎲 Edifício Aleatório
      </button>

      <Canvas
        shadows
        orthographic
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ backgroundColor: "#5da25d" }}
        onCreated={({ camera }) => {
          camera.position.set(25, 25, 25);
          camera.zoom = 55;
          camera.updateProjectionMatrix();
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1.1} />

        <Suspense fallback={null}>
          <GridWrapper
            buildings={buildings}
            handleLotClick={handleLotClick}
            setMenuPosition={setMenuPosition}
            movingMode={movingMode}
            setMovingMode={setMovingMode}
            getBuildingAtLot={getBuildingAtLot}
          />
        </Suspense>

        <OrbitControls
          enableRotate={false}
          enablePan={true}
          panSpeed={0.8}
          enableZoom={true}
          zoomSpeed={1.9}
          minZoom={20}
          maxZoom={80}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <directionalLight position={[-5, 10, -5]} intensity={0.8} />
      </Canvas>

      {movingMode.active && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3498db",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            fontWeight: "bold",
            zIndex: 99,
          }}
        >
          🚚 Clique em um lote vazio (ou área vazia) para mover o edifício de{" "}
          {movingMode.buildingData.size}x{movingMode.buildingData.size}
        </div>
      )}

      {menuPos && selectedLot && (
        <BuildMenu
          x={menuPos.x}
          y={menuPos.y}
          options={options}
          currentType={currentType}
          currentVariant={currentVariant}
          maxVariants={maxVariants}
          isMultiSize={isMultiSize}
          onSelect={handleSelectBuilding}
          onMove={handleMove}
          onDemolish={handleDemolish}
          onChangeVariant={handleChangeVariant}
          onClose={() => {
            setSelectedLot(null);
            setMenuPosition(null);
          }}
        />
      )}
    </div>
  );
}
