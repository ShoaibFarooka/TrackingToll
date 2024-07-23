import AdminView from "../views/AdminView/AdminView.jsx";
import ApplicationTeamView from "../views/ApplicationTeamView/ApplicationTeamView.jsx";
import AssetInventoryTeamView from "../views/AssetInventoryTeamView/AssetInventoryTeamView.jsx";
import FieldOperationTeamView from "../views/FieldOperationTeamView/FieldOperationTeamView.jsx";
import LogisticsTeamView from "../views/LogisticsTeamView/LogisticsTeamView.jsx";
import OperationsSupportTeamView from "../views/OperationsSupportTeamView/OperationsSupportTeamView.jsx";
import RepairMaintenanceTeamView from "../views/RepairMaintenanceTeamView/RepairMaintenanceTeamView.jsx";
import SalesTeamView from "../views/SalesTeamView/SalesTeamView.jsx";

const teamViews = {
    admin: AdminView,
    sales: SalesTeamView,
    application: ApplicationTeamView,
    operations_support: OperationsSupportTeamView,
    asset_inventory: AssetInventoryTeamView,
    repair_maintenance: RepairMaintenanceTeamView,
    logistics: LogisticsTeamView,
    field_operation: FieldOperationTeamView,
};

export default teamViews;