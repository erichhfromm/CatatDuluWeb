<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private ReportService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = auth()->user()->reports();

        if ($request->has('type')) {
            $query->where('report_type', $request->type);
        }

        $reports = $query->orderBy('generated_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json(ReportResource::collection($reports));
    }

    public function generateSummary(): JsonResponse
    {
        $data = $this->service->generateSummaryReport(auth()->user());

        $report = auth()->user()->reports()->create([
            'name' => 'Monthly Summary - ' . now()->format('F Y'),
            'report_type' => 'summary',
            'format' => 'json',
            'data' => $data,
            'generated_at' => now(),
        ]);

        return response()->json(new ReportResource($report), 201);
    }

    public function generateDetailed(): JsonResponse
    {
        $data = $this->service->generateDetailedReport(auth()->user());

        $report = auth()->user()->reports()->create([
            'name' => 'Detailed Report - ' . now()->format('F Y'),
            'report_type' => 'detailed',
            'format' => 'json',
            'data' => $data,
            'generated_at' => now(),
        ]);

        return response()->json(new ReportResource($report), 201);
    }

    public function generateComparative(Request $request): JsonResponse
    {
        $months = (int) $request->get('months', 12);
        $data = $this->service->generateComparativeReport(auth()->user(), $months);

        $report = auth()->user()->reports()->create([
            'name' => "Comparative Report - {$months} months",
            'report_type' => 'comparative',
            'format' => 'json',
            'data' => $data->toArray(),
            'generated_at' => now(),
        ]);

        return response()->json(new ReportResource($report), 201);
    }

    public function generateForecast(Request $request): JsonResponse
    {
        $months = (int) $request->get('months', 12);
        $data = $this->service->generateForecastReport(auth()->user(), $months);

        $report = auth()->user()->reports()->create([
            'name' => "Forecast Report - {$months} months",
            'report_type' => 'forecast',
            'format' => 'json',
            'data' => $data,
            'generated_at' => now(),
        ]);

        return response()->json(new ReportResource($report), 201);
    }

    public function show(Report $report): JsonResponse
    {
        $this->authorize('view', $report);

        return response()->json(new ReportResource($report));
    }

    public function export(Request $request): JsonResponse
    {
        $format = $request->validate(['format' => 'required|in:csv,pdf'])['format'];

        $filePath = match ($format) {
            'csv' => $this->service->exportToCsv(auth()->user()),
            'pdf' => $this->service->exportToPdf(['user' => auth()->user()]),
        };

        return response()->json([
            'message' => 'Report exported successfully',
            'file_path' => $filePath,
            'download_url' => url('storage/' . $filePath),
        ]);
    }

    public function delete(Report $report): JsonResponse
    {
        $this->authorize('delete', $report);

        $report->delete();

        return response()->json(['message' => 'Report deleted']);
    }
}
