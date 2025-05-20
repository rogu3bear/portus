"""Add WebAuthn credential table

Revision ID: 0001
Revises: 
Create Date: 2025-05-20
"""

from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema by creating webauthn_credential table."""
    op.create_table(
        "webauthn_credential",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(), nullable=False),
        sa.Column("credential_id", sa.String(), nullable=False, unique=True),
        sa.Column("credential_data", sa.LargeBinary(), nullable=False),
        sa.Column("sign_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )
    op.create_index(
        "ix_webauthn_credential_username", "webauthn_credential", ["username"]
    )


def downgrade() -> None:
    """Drop webauthn_credential table."""
    op.drop_table("webauthn_credential")
