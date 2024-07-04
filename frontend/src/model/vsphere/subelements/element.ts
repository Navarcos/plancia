export interface Status {
    conditions: Condition[];
    controlPlaneReady: boolean;
    failureDomains: FailureDomain;
    failureMessage: string;
    failureReason: string;
    infrastructureReady: boolean;
    observedGeneration: number;
    phase: string;
}

export interface Condition {
    lastTransitionTime: string;
    message: string;
    reason: string;
    severity: string;
    status: string;
    type: string;
}

export interface FailureDomain {
    additionalProp1: AdditionalProp;
    additionalProp2: AdditionalProp;
    additionalProp3: AdditionalProp;
}

export interface AdditionalProp {
    attributes: AddProps[];
    controlPlane: boolean;
}

export interface AddProps {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
}

export interface SkafosResourceStats {
    failed: number;
    pending: number;
    running: number;
    succeeded: number;
    total: number;
}




