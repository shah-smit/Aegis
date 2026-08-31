import { TelemetrySpan } from '../src/types';

export class OpenTelemetryCollector {
  private spans: TelemetrySpan[] = [];

  public startSpan(params: {
    traceId: string;
    parentSpanId?: string;
    agentId: string;
    agentName: string;
    operationName: string;
    attributes?: Record<string, any>;
  }): { spanId: string; end: (status?: 'OK' | 'ERROR', extraAttrs?: Record<string, any>) => TelemetrySpan } {
    const spanId = `span-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const startTime = Date.now();
    const attributes = params.attributes || {};

    return {
      spanId,
      end: (status: 'OK' | 'ERROR' = 'OK', extraAttrs?: Record<string, any>) => {
        const endTime = Date.now();
        const durationMs = Math.max(1, endTime - startTime);
        const finalSpan: TelemetrySpan = {
          spanId,
          traceId: params.traceId,
          parentSpanId: params.parentSpanId,
          agentId: params.agentId,
          agentName: params.agentName,
          operationName: params.operationName,
          startTime,
          endTime,
          durationMs,
          status,
          attributes: { ...attributes, ...(extraAttrs || {}) },
        };
        this.spans.push(finalSpan);
        return finalSpan;
      },
    };
  }

  public getSpansForTrace(traceId: string): TelemetrySpan[] {
    return this.spans.filter(s => s.traceId === traceId);
  }

  public getAllSpans(): TelemetrySpan[] {
    return this.spans;
  }
}

export const telemetry = new OpenTelemetryCollector();
