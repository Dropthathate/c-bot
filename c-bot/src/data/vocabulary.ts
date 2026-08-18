export interface VocabularyItem {
  term: string;
  category: "muscle" | "tendon" | "joint" | "nerve" | "soft-tissue" | "finding" | "command";
  subcategory?: string;
}

export const muscles: VocabularyItem[] = [
  { term: "Upper trapezius", category: "muscle", subcategory: "Neck & Shoulder" },
  { term: "Levator scapulae", category: "muscle", subcategory: "Neck & Shoulder" },
  { term: "Sternocleidomastoid", category: "muscle", subcategory: "Neck" },
  { term: "Scalenes (ant/mid/post)", category: "muscle", subcategory: "Neck" },
  { term: "Supraspinatus", category: "muscle", subcategory: "Rotator Cuff" },
  { term: "Infraspinatus", category: "muscle", subcategory: "Rotator Cuff" },
  { term: "Subscapularis", category: "muscle", subcategory: "Rotator Cuff" },
  { term: "Deltoid (ant/mid/post)", category: "muscle", subcategory: "Shoulder" },
  { term: "Pectoralis major", category: "muscle", subcategory: "Chest" },
  { term: "Pectoralis minor", category: "muscle", subcategory: "Chest" },
  { term: "Latissimus dorsi", category: "muscle", subcategory: "Back" },
  { term: "Rhomboids", category: "muscle", subcategory: "Back" },
  { term: "Serratus anterior", category: "muscle", subcategory: "Trunk" },
  { term: "Erector spinae", category: "muscle", subcategory: "Back" },
  { term: "Quadratus lumborum", category: "muscle", subcategory: "Lumbar" },
  { term: "Iliopsoas", category: "muscle", subcategory: "Hip Flexor" },
  { term: "Rectus femoris", category: "muscle", subcategory: "Quadriceps" },
  { term: "Hamstrings", category: "muscle", subcategory: "Posterior Thigh" },
  { term: "Gluteus maximus", category: "muscle", subcategory: "Gluteal" },
  { term: "Gluteus medius", category: "muscle", subcategory: "Gluteal" },
  { term: "Gluteus minimus", category: "muscle", subcategory: "Gluteal" },
  { term: "Piriformis", category: "muscle", subcategory: "Deep Hip" },
  { term: "Tensor fasciae latae", category: "muscle", subcategory: "Hip" },
  { term: "Gastrocnemius", category: "muscle", subcategory: "Calf" },
  { term: "Soleus", category: "muscle", subcategory: "Calf" },
  { term: "Tibialis anterior", category: "muscle", subcategory: "Lower Leg" },
  { term: "Peroneals", category: "muscle", subcategory: "Lower Leg" },
];

export const tendons: VocabularyItem[] = [
  { term: "Achilles", category: "tendon" },
  { term: "Patellar", category: "tendon" },
  { term: "Supraspinatus (rotator cuff)", category: "tendon" },
  { term: "Biceps (long head)", category: "tendon" },
  { term: "Common extensor (lateral elbow)", category: "tendon" },
  { term: "Common flexor (medial elbow)", category: "tendon" },
];

export const joints: VocabularyItem[] = [
  { term: "Glenohumeral", category: "joint" },
  { term: "Acromioclavicular", category: "joint" },
  { term: "Sternoclavicular", category: "joint" },
  { term: "Elbow (humeroulnar, radioulnar)", category: "joint" },
  { term: "Wrist", category: "joint" },
  { term: "Hip (coxofemoral)", category: "joint" },
  { term: "Sacroiliac", category: "joint" },
  { term: "Lumbar vertebrae", category: "joint" },
  { term: "Cervical vertebrae", category: "joint" },
  { term: "Knee (tibiofemoral, patellofemoral)", category: "joint" },
  { term: "Ankle", category: "joint" },
];

export const nerves: VocabularyItem[] = [
  { term: "Sciatic", category: "nerve" },
  { term: "Median", category: "nerve" },
  { term: "Ulnar", category: "nerve" },
  { term: "Radial", category: "nerve" },
  { term: "Femoral", category: "nerve" },
];

export const softTissues: VocabularyItem[] = [
  { term: "Thoracolumbar fascia", category: "soft-tissue" },
  { term: "Iliotibial band", category: "soft-tissue" },
  { term: "MCL", category: "soft-tissue" },
  { term: "LCL", category: "soft-tissue" },
  { term: "ACL", category: "soft-tissue" },
  { term: "PCL", category: "soft-tissue" },
  { term: "GH joint capsule", category: "soft-tissue" },
  { term: "SI ligaments", category: "soft-tissue" },
];

export const clinicalFindings: VocabularyItem[] = [
  { term: "Shortened", category: "finding" },
  { term: "Lengthened", category: "finding" },
  { term: "Tight / Hypertonic", category: "finding" },
  { term: "Weak / Inhibited", category: "finding" },
  { term: "Restricted ROM", category: "finding" },
  { term: "Compensated / Overactive", category: "finding" },
  { term: "Tender", category: "finding" },
  { term: "Inflamed", category: "finding" },
  { term: "Compressed / Impinged", category: "finding" },
  { term: "Referred pain pattern", category: "finding" },
];

export const commands: VocabularyItem[] = [
  { term: "Mark:", category: "command" },
  { term: "Note:", category: "command" },
  { term: "Restriction:", category: "command" },
  { term: "Referral:", category: "command" },
  { term: "Trigger point:", category: "command" },
  { term: "Weakness:", category: "command" },
  { term: "Tightness:", category: "command" },
  { term: "Lengthened:", category: "command" },
];

export const allVocabulary: VocabularyItem[] = [
  ...muscles,
  ...tendons,
  ...joints,
  ...nerves,
  ...softTissues,
  ...clinicalFindings,
  ...commands,
];
