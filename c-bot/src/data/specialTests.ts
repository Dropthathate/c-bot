export interface SpecialTest {
  id: string;
  name: string;
  implication: string;
  clinicalNotes: string[];
  associatedStructures: string[];
  category: "hip" | "spine" | "shoulder" | "knee" | "general";
}

export const specialTests: SpecialTest[] = [
  {
    id: "slr",
    name: "SLR (Straight Leg Raise)",
    implication: "Sciatic nerve irritation due to lumbar disc pathology, most often a herniation at L4/L5 or L5/S1.",
    clinicalNotes: [
      "A true positive test is defined by the reproduction of radicular pain (sharp, shooting pain below the knee), not just posterior thigh stretch.",
      "Hamstring tightness alone can limit motion and must be differentiated from a true positive.",
    ],
    associatedStructures: [
      "Sciatic nerve along its course",
      "L4, L5, and S1 nerve roots",
      "Dural sheath tension",
      "Hamstrings (to rule out false positives)",
      "Gluteal musculature (especially piriformis)",
      "Lumbar spine segmental mobility",
    ],
    category: "spine",
  },
  {
    id: "faber",
    name: "FABER (Patrick's) Test",
    implication: "Hip joint pathology or sacroiliac joint dysfunction.",
    clinicalNotes: [
      "Pain in the groin area may indicate hip joint issues.",
      "Pain in the lower back may suggest sacroiliac joint dysfunction.",
      "The location of the patient's pain is the primary guide to interpreting the test result.",
    ],
    associatedStructures: [
      "Hip joint",
      "Sacroiliac joint",
      "Iliopsoas muscle",
      "Quadratus lumborum",
      "Anterior hip capsule",
      "Labrum",
      "SI joint & ligaments",
      "Adductor muscles",
    ],
    category: "hip",
  },
  {
    id: "fadir",
    name: "FADIR Test",
    implication: "Femoroacetabular Impingement (FAI) and/or an acetabular labral tear.",
    clinicalNotes: [
      "The primary focus of a positive test is FAI syndrome.",
      "May also indicate iliopsoas-related issues.",
    ],
    associatedStructures: [
      "Femoral Head–Neck Junction (cam morphology)",
      "Acetabular Rim (pincer morphology)",
      "Anterior Labrum",
      "Chondral Surfaces of the Acetabulum",
      "Iliopsoas Tendon & Bursa",
    ],
    category: "hip",
  },
  {
    id: "ober",
    name: "Ober Test",
    implication: "IT band and/or Tensor Fasciae Latae (TFL) tightness.",
    clinicalNotes: [
      "A positive test primarily indicates tightness in the IT band/TFL complex.",
      "May contribute to lateral knee or hip pain.",
    ],
    associatedStructures: [
      "IT band (along lateral thigh)",
      "Tensor Fasciae Latae (TFL)",
      "Gluteus medius & minimus",
    ],
    category: "hip",
  },
];

export interface PosturalPattern {
  id: string;
  name: string;
  associatedFindings: {
    tissue: string;
    expectedState: string;
  }[];
}

export const posturalPatterns: PosturalPattern[] = [
  {
    id: "forward-head",
    name: "Forward Head Posture",
    associatedFindings: [
      { tissue: "Deep neck flexors", expectedState: "Weak / Inhibited" },
      { tissue: "Suboccipitals", expectedState: "Tight / Hypertonic" },
      { tissue: "Upper trapezius", expectedState: "Compensated / Overactive" },
    ],
  },
  {
    id: "anterior-pelvic-tilt",
    name: "Anterior Pelvic Tilt",
    associatedFindings: [
      { tissue: "Iliopsoas", expectedState: "Tight / Hypertonic" },
      { tissue: "Rectus femoris", expectedState: "Tight / Hypertonic" },
      { tissue: "Erector spinae", expectedState: "Tight / Hypertonic" },
      { tissue: "Gluteus maximus", expectedState: "Lengthened / Inhibited" },
      { tissue: "Hamstrings", expectedState: "Lengthened / Inhibited" },
    ],
  },
  {
    id: "rounded-shoulders",
    name: "Rounded Shoulders",
    associatedFindings: [
      { tissue: "Pectoralis major", expectedState: "Tight / Hypertonic" },
      { tissue: "Pectoralis minor", expectedState: "Tight / Hypertonic" },
      { tissue: "Rhomboids", expectedState: "Lengthened / Inhibited" },
      { tissue: "Lower trapezius", expectedState: "Weak / Inhibited" },
    ],
  },
];
